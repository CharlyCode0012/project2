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
import "./shopping.css";
import { Shopping } from "models/Shopping";
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

	const [shoppings, setShopping] = useState<Shopping[]>([]);
	const selectedShoppingToEdit = useRef<Shopping | boolean>(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["Id", "No. celular cliente", "Cantidad de compras"];

	const searchOptions = ["Celular", "Cantidad"];

	useEffect(() => {
		// fetchProducts();
	}, []);

	async function fetchProducts() {
		try {
			const { data: shoppings } = await instance.get<Shopping[]>(url);
			setShopping(shoppings);
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

	async function deleteShopping(Shopping: Shopping) {
		const { id } = Shopping;
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
				const newCatalogs = shoppings.filter(
					(CatalogD) => CatalogD.id !== deleteShoppingID
				);
				setShopping(newCatalogs);
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
			let shoppings: Shopping[];

			switch (filter) {
			case "Nombre":
				shoppings = (
					await instance.get<Shopping[]>(
						`/products/productByName/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			case "Estado":
				shoppings = (
					await instance.get<Shopping[]>(`/products/productBy/${search}`, {
						params: { order },
					})
				).data;
				break;

			default:
				shoppings = (
					await instance.get<Shopping[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setShopping(shoppings);
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
									{!(shoppings?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										shoppings?.map((Shopping) => (
											<TableRow key={Shopping.id}>
												<TableCell align="left">{Shopping.id}</TableCell>
												<TableCell align="left">
													<NavLink
														to={`/analisis/analisis-clientes/client/${Shopping.id_client}`}
													>
														{Shopping.id_client}
													</NavLink>
												</TableCell>
												<TableCell align="left">{Shopping.quantity}</TableCell>
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
