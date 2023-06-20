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
import React, { useState, useEffect } from "react";
import "./shopping.css";
import { Client } from "models/Client";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
// import Modal from "@/Modal/Modal";
// import ProductForm from "./ProductForm";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import { NavLink } from "react-router-dom";
import NavbarAnalisis from "@/Navbar/NavbarAnalisis";

const AnalisisClientes: React.FC = () => {
	const url = "/clients";

	const { enqueueSnackbar } = useSnackbar();

	const [shoppings, setShopping] = useState<Client[]>([]);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["Id", "No. celular cliente", "Cantidad de compras"];

	const searchOptions = ["Celular", "Cantidad"];

	useEffect(() => {
		fetchClients();
	}, []);

	async function fetchClients() {
		try {
			const { data: shoppings } = await instance.get<Client[]>(url);
			setShopping(shoppings);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las productos", {
				variant: "error",
			});
		}
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let shoppings: Client[];

			switch (filter) {
			case "Nombre":
				shoppings = (
					await instance.get<Client[]>(`/products/productByName/${search}`, {
						params: { order },
					})
				).data;
				break;

			case "Estado":
				shoppings = (
					await instance.get<Client[]>(`/products/productBy/${search}`, {
						params: { order },
					})
				).data;
				break;

			default:
				shoppings = (
					await instance.get<Client[]>(url, {
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
						<h1>Analisis Clientes</h1>
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
										shoppings?.map((Client) => (
											<TableRow key={Client.id}>
												<TableCell align="left">{Client.id}</TableCell>
												<TableCell align="left">
													<NavLink
														to={`/analisis/cliente/${Client.number}`}
														style={{ color: "inherit", textDecoration: "none" }}
													>
														{Client.number}
													</NavLink>
												</TableCell>
												<TableCell align="left">{Client.purcharses}</TableCell>
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
