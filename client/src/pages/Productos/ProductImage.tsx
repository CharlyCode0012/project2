import NavbarProduct from "@/Navbar/NavbarProduct";
import {
	AppBar,
	Box,
	Button,
	Chip,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Toolbar,
	useTheme,
} from "@mui/material";
import React, {
	ChangeEvent,
	FormEvent,
	ReactNode,
	useRef,
	useState,
	useEffect,
} from "react";
import { instance } from "helper/API";
import { Catalog } from "models/Catalog";
import { Product } from "models/Product";
import { enqueueSnackbar } from "notistack";

const ProductImage = () => {
	// images/id_product
	const [filename, setFilename] = useState("");

	const [productId, setProductId] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [selectedImage, setSelectedImage] = useState<File | undefined>();
	const [imageUrl, setImageUrl] = useState<string>("");
	const catalogId = useRef<string>("");
	const theme = useTheme();

	useEffect(() => {
		// fetchProducts();
		fetchCatalogs();
	}, []);

	async function fetchCatalogs() {
		try {
			const { data: Catalogs } = await instance.get<Catalog[]>("/catalogs");
			setCatalogs(Catalogs);
		}
		catch {
			enqueueSnackbar("Hubo un error al traer los catalogos", {
				variant: "error",
			});
		}
	}

	async function fetchProducts() {
		const cId = catalogId.current;
		try {
			const { data: products } = await instance.get<Product[]>("/products", {
				params: { order: "ASC", catalogId: cId },
			});
			setProducts(products);
			enqueueSnackbar("Se mostraron los productos con extio", {
				variant: "success",
			});
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file: File | undefined = event.target.files?.[0];
		setSelectedImage(file);
		setFilename(event.target.value.split("\\").pop() ?? "Selected image file");
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		if (selectedImage) {
			const formData = new FormData();
			formData.append("image", selectedImage);

			try {
				const response = await instance.post("/images", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					params: { id_product: imageUrl },
				});

				// Manejar la respuesta del servidor aquí
				console.log(response.data);
				enqueueSnackbar("Se subio la imagen con exito", {
					variant: "success",
				});
				setImageUrl(response.data.image_url);
			}
			catch (error) {
				// Manejar el error aquí
				console.error(error);
				enqueueSnackbar("Fallo en subir la imagen", {
					variant: "error",
				});
			}
			const temp = imageUrl;
			setImageUrl("default");
			setImageUrl(temp);
		}
	}

	function handleCatalogChange(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		catalogId.current = event.target.value as string;
		setImageUrl("default");
		setProductId("");
		if (catalogId.current) fetchProducts();
	}

	function handleProductChange(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		const id = event.target.value as string;
		setProductId(id);
		setImageUrl(id);
	}

	return (
		<>
			<NavbarProduct />
			<Container maxWidth="sm">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: "10px",
						}}
					>
						<Box
							sx={{ flexGrow: 0, marginTop: "40px", width: "800px" }}
							color="inherit"
						>
							<AppBar position="static">
								<Toolbar sx={{ padding: "10px", gap: "10px" }}>
									<FormControl
										color={
											theme.palette.mode === "dark" ? "secondary" : "warning"
										}
									>
										<InputLabel sx={{ color: "inherit" }}>Catálogo</InputLabel>
										<Select
											label="Catálogo"
											sx={{ width: "300px", color: "inherit" }}
											onChange={handleCatalogChange}
										>
											{catalogs?.length > 0 ? (
												catalogs?.map((catalog: Catalog) => (
													<MenuItem key={catalog.id} value={catalog.id}>
														{catalog.name}
													</MenuItem>
												))
											) : (
												<MenuItem value=""> Sin catalogos</MenuItem>
											)}
										</Select>
									</FormControl>
									<FormControl
										color={
											theme.palette.mode === "dark" ? "secondary" : "warning"
										}
									>
										<InputLabel sx={{ color: "inherit" }}>Producto</InputLabel>
										<Select
											value={productId}
											label="Producto"
											sx={{ width: "300px", color: "inherit" }}
											onChange={handleProductChange}
										>
											{products?.length > 0 ? (
												products?.map((product: Product) => (
													<MenuItem key={product.id} value={product.id}>
														{product.product_name}
													</MenuItem>
												))
											) : (
												<MenuItem value=""> Sin catalogos</MenuItem>
											)}
										</Select>
									</FormControl>
								</Toolbar>
							</AppBar>
						</Box>

						<img
							src={`https://server-databot-2184e3a8d57a.herokuapp.com/api/images/${imageUrl}`}
							// src={`http://localhost:3200/api/images/${imageUrl}`}
							style={{ width: "200px", height: "200px" }}
						></img>
						<Box
							component="form"
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								gap: "10px",
							}}
							onSubmit={handleSubmit}
						>
							<input
								accept="image/*"
								name="image"
								id="file-input"
								type="file"
								hidden
								onChange={handleImageChange}
							/>
							<label htmlFor="file-input">
								<Button variant="outlined" color="primary" component="span">
									Seleccionar una imagen
								</Button>
							</label>

							{filename !== "" ? (
								<Chip variant="outlined" label={filename} />
							) : (
								<></>
							)}

							<Button type="submit" variant="contained" color="primary">
								Subir archivo
							</Button>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default ProductImage;
