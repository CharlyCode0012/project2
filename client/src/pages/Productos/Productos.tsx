import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import {
	Box,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Container,
	InputLabel,
	FormControl,
	Select,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Product } from "models/Product";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import ProductForm from "./ProductForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import NavbarProduct from "@/Navbar/NavbarProduct";
import { Catalog } from "models/Menu";

const Products: React.FC = () => {
	const url = "/products";

	const { enqueueSnackbar } = useSnackbar();

	const catalogId = useRef<string>("");
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const selectedProductToEdit = useRef<Product | boolean>(false);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = [
		"Nombre",
		"Palabra Clave",
		"Precio",
		"Cantidad",
		"Imagen",
	];

	const searchOptions = ["Nombre", "Precio", "Cantidad"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isAdmin: boolean =
		typeUser === "admin" || typeUser === "vendedor" ? true : false;

	// console.log(isAdmin);
	// TODO:

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
			const { data: products } = await instance.get<Product[]>(url, {
				params: { order: "ASC", catalogId: cId },
			});
			setProducts(products);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	function onProductSubmitted(wasUpdates: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasUpdates ? "Se actualizo exitosamente" : "Se creo con exito",
			{
				variant: "success",
			}
		);
		fetchProducts();
	}

	function handleEdit(product: Product) {
		selectedProductToEdit.current = product;
		openFormModal();
	}

	async function createProduct() {
		selectedProductToEdit.current = false;
		openFormModal();
	}

	async function deleteProduct(product: Product) {
		const { name, id } = product;
		const deletedProductID: string = id;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		const endpoint = `${url}/${deletedProductID}`;
		if (isDelete) {
			try {
				console.log(`delete endpoint: ${endpoint}`);

				const res = await instance.delete(endpoint);
				const dataCatalog = await res.data;

				if (dataCatalog?.err) {
					const message = dataCatalog?.statusText;
					const status = dataCatalog?.status;
					throw { message, status };
				}
				else {
					const newCatalogs = products.filter(
						(ProductD: Product) => ProductD.id !== deletedProductID
					);
					setProducts(newCatalogs);
				}
				enqueueSnackbar(`Se elimino exitosamente ${name}`, {
					variant: "success",
				});
			}
			catch (error: any) {
				enqueueSnackbar(`Error al eliminar la ${name}`, { variant: "error" });
				alert(
					`Descripcion del error: ${error.message}\nEstado: ${
						error?.status ?? 500
					}`
				);
			}
		}
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let Products: Product[];

			switch (filter) {
			case "Nombre":
				Products = (
					await instance.get<Product[]>(`/products/productByName/${search}`, {
						params: { order },
					})
				).data;
				break;

			case "Estado":
				Products = (
					await instance.get<Product[]>(`/products/productBy/${search}`, {
						params: { order },
					})
				).data;
				break;

			default:
				Products = (
					await instance.get<Product[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setProducts(Products);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	function handleCatalogChange(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		catalogId.current = event.target.value as string;

		if (catalogId.current) fetchProducts();
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
						<SearchAppBar
							searchOptions={searchOptions}
							onSubmitSearch={onSubmitSearch}
						/>
						<h1>productos</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario productos"
							>
								<ProductForm
									onSubmit={onProductSubmitted}
									ProductData={
										selectedProductToEdit.current instanceof Object
											? selectedProductToEdit.current
											: undefined
									}
								></ProductForm>
							</Modal>
						)}
						<TableContainer
							sx={{ width: "900px", maxHeight: "400px" }}
							component={Paper}
							elevation={5}
						>
							<Table>
								<TableHead>
									<TableRow>
										{tableHeaders.map((header) => (
											<TableCell key={header} align="left">
												<TableSortLabel>{header}</TableSortLabel>
											</TableCell>
										))}

										{isAdmin && <TableCell />}
									</TableRow>
								</TableHead>

								<TableBody>
									{!(products?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										products?.map((product: Product) => (
											<TableRow key={product.id}>
												<TableCell align="left">{product.name}</TableCell>
												<TableCell align="left">{product.key_word}</TableCell>
												<TableCell align="left">{product.price}</TableCell>
												<TableCell align="left">{product.stock}</TableCell>
												<TableCell align="left">{product.img}</TableCell>

												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(product)}>
															<Edit fontSize="inherit" />
														</IconButton>
														<IconButton onClick={() => deleteProduct(product)}>
															<DeleteForever fontSize="inherit" />
														</IconButton>
													</TableCell>
												)}
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								gap: "10px",
							}}
						>
							{isAdmin && (
								<IconButton
									sx={{
										alignSelf: "flex-start",
										fontSize: "40px",
										padding: "0px",
									}}
									onClick={() => createProduct()}
								>
									<AddCircle fontSize="inherit" />
								</IconButton>
							)}
							<ExcelDownloadButton apiObjective="products" />

							<FormControl>
								<InputLabel>Catalogo</InputLabel>
								<Select
									label="Catalogo"
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
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Products;
