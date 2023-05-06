import {
	Box,
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
import { SoldProduct } from "models/SoldProduct";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
// import Modal from "@/Modal/Modal";
// import ProductForm from "./ProductForm";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import { NavLink } from "react-router-dom";
import NavbarAnalisis from "@/Navbar/NavbarAnalisis";

const AnalisisClientes: React.FC = () => {
	const url = "/products";

	const { enqueueSnackbar } = useSnackbar();

	const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
	const selectedShoppingToEdit = useRef<SoldProduct | boolean>(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["Id", "Categoria", "Producto", "Cantidad de compras"];

	const searchOptions = ["Categoria", "Producto", "Cantidad de Compras"];

	useEffect(() => {
		// fetchProducts();
	}, []);

	async function fetchProducts() {
		try {
			const { data: soldProducts } = await instance.get<SoldProduct[]>(url);
			setSoldProducts(soldProducts);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las productos", {
				variant: "error",
			});
		}
	}

	function onProductSubmitted(wasUpdates: boolean) {
		enqueueSnackbar(
			wasUpdates ? "Se actualizo exitosamente" : "Se creo con exito",
			{
				variant: "success",
			}
		);
		fetchProducts();
	}

	async function deleteShopping(SoldProduct: SoldProduct) {
		const { id } = SoldProduct;
		const deleteShoppingID: number = id;
		// TODO: Display loader
		const endpoint = `${url}/${deleteShoppingID}`;

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
				const newCatalogs = soldProducts.filter(
					(CatalogD) => CatalogD.id !== deleteShoppingID
				);
				setSoldProducts(newCatalogs);
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

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let soldProducts: SoldProduct[];

			switch (filter) {
			case "Categoria":
				soldProducts = (
					await instance.get<SoldProduct[]>(
						`/products/productByCategory/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			case "Producto":
				soldProducts = (
					await instance.get<SoldProduct[]>(
						`/products/productByName/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;
			case "Cantidad de Compras":
				soldProducts = (
					await instance.get<SoldProduct[]>(
						`/products/productByQuantity/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			default:
				soldProducts = (
					await instance.get<SoldProduct[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setSoldProducts(soldProducts);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los productos", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<NavbarAnalisis />
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
									</TableRow>
								</TableHead>

								<TableBody>
									{!(soldProducts?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										soldProducts?.map((SoldProduct) => (
											<TableRow key={SoldProduct.id}>
												<TableCell align="left">{SoldProduct.id}</TableCell>
												<TableCell align="left">
													{SoldProduct.id_category}
												</TableCell>
												;
												<TableCell align="left">
													{SoldProduct.id_product}
												</TableCell>
												<TableCell align="left">
													{SoldProduct.quantity}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default AnalisisClientes;
