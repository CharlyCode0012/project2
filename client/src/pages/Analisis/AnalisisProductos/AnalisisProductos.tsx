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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { SoldProduct } from "models/SoldProduct";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
// import Modal from "@/Modal/Modal";
// import ProductForm from "./ProductForm";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import NavbarAnalisis from "@/Navbar/NavbarAnalisis";

const AnalisisClientes: React.FC = () => {
	const url = "/sold_products";

	const { enqueueSnackbar } = useSnackbar();

	const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
	const timePeriodSelected = useRef<string>("1 semana");

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = [
		"#",
		"Producto Id",
		"Categoria",
		"Producto",
		"Cantidad de compras",
	];

	const searchOptions = ["Cantidad de Compras"];

	const timePeriods = ["1 semana", "1 mes", "2 meses", "6 meses"];

	async function fetchSoldProducts() {
		try {
			const { data: soldProducts } = await instance.get<SoldProduct[]>(url, {
				params: { timePeriod: timePeriodSelected.current },
			});
			setSoldProducts(soldProducts);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las productos", {
				variant: "error",
			});
		}
	}

	useEffect(() => {
		fetchSoldProducts();
	}, []);

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let soldProducts: SoldProduct[];

			switch (filter) {
			case "Cantidad de Compras":
				soldProducts = (
					await instance.get<SoldProduct[]>("/sold_products/searchByStock", {
						params: { order, timePeriod: timePeriodSelected.current, search },
					})
				).data;
				break;

			default:
				soldProducts = (
					await instance.get<SoldProduct[]>(url, {
						params: { order, timePeriod: timePeriodSelected.current },
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

	function handleTimePeriodChange(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		timePeriodSelected.current = event.target.value as string;
		// fetchSoldProducts();
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
						<h1>Analisis Productos</h1>
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
										soldProducts?.map((SoldProduct, index) => (
											<TableRow key={SoldProduct.id}>
												<TableCell align="left">{index + 1}</TableCell>
												<TableCell align="left">{SoldProduct.id}</TableCell>
												<TableCell align="left">
													{SoldProduct.category}
												</TableCell>
												<TableCell align="left">
													{SoldProduct.product}
												</TableCell>
												<TableCell align="left">
													{SoldProduct.total_sold}
												</TableCell>
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
							<FormControl sx={{ justifyContent: "flex-end" }}>
								<InputLabel>Periodo</InputLabel>
								<Select
									label="Periodo"
									sx={{ width: "300px", color: "inherit" }}
									onChange={handleTimePeriodChange}
								>
									{timePeriods?.map((time) => (
										<MenuItem key={time} value={time}>
											{time}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default AnalisisClientes;
