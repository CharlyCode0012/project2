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
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import "./Products.css";
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

const Products: React.FC = () => {
	const url = "/products";

	const { enqueueSnackbar } = useSnackbar();

	const [Products, setCatalogs] = useState<Product[]>([]);
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
		"ID",
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
	}, []);

	async function fetchProducts() {
		try {
			const { data: Products } = await instance.get<Product[]>(url);
			setCatalogs(Products);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las productos", {
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

	function handleEdit(Product: Product) {
		selectedProductToEdit.current = Product;
		openFormModal();
	}

	async function createProduct() {
		selectedProductToEdit.current = false;
		openFormModal();
	}

	async function deleteProduct(Product: Product) {
		const { name, id } = Product;
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
					const newCatalogs = Products.filter(
						(CatalogD) => CatalogD.id !== deletedProductID
					);
					setCatalogs(newCatalogs);
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

			setCatalogs(Products);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<NavbarProduct />
			<Container maxWidth="sm">
				<Box
					sx={{
						height: "560px",
						flexGrow: 1,
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
							sx={{ width: "800px", maxHeight: "400px" }}
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
									{!(Products?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										Products?.map((Product) => (
											<TableRow key={Product.id}>
												<TableCell align="left">{Product.id}</TableCell>
												<TableCell align="left">{Product.name}</TableCell>
												<TableCell align="left">{Product.key_word}</TableCell>
												<TableCell align="left">{Product.price}</TableCell>
												<TableCell align="left">{Product.stock}</TableCell>
												<TableCell align="left">{Product.img}</TableCell>

												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(Product)}>
															<Edit fontSize="inherit" />
														</IconButton>
														<IconButton onClick={() => deleteProduct(Product)}>
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
						{isAdmin && (
							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									gap: "10px",
								}}
							>
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

								<ExcelDownloadButton apiObjective="products" />
							</Box>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Products;
