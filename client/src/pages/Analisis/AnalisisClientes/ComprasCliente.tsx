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
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import "./shopping.css";
import { Shopping } from "models/Shopping";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import NavbarAnalisis from "@/Navbar/NavbarAnalisis";

const ComprasCliente: React.FC = () => {
	const url = "/shoppings";

	const { enqueueSnackbar } = useSnackbar();
	const { clientId } = useParams();

	const [shoppings, setShopping] = useState<Shopping[]>([]);
	const timePeriodSelected = useRef<string | null>(null);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = [
		"#",
		"Producto",
		"Palabra clave",
		"Cantidad de compras",
		"Fecha de la compra",
	];

	const timePeriods = ["1 semana", "1 mes", "2 meses", "6 meses"];

	useEffect(() => {
		fetchShopping();
	}, []);

	async function fetchShopping() {
		try {
			const { data: shoppings } = await instance.get<Shopping[]>(url, {
				params: { clientId, timePeriod: timePeriodSelected.current },
			});
			setShopping(shoppings);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las productos", {
				variant: "error",
			});
		}
	}

	function handleTimePeriodChange(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		timePeriodSelected.current = event.target.value as string;
		fetchShopping();
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
						<h1>Análisis de Compras</h1>
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
										shoppings?.map((Shopping, index) => (
											<TableRow key={Shopping.id}>
												<TableCell align="left">{index + 1}</TableCell>
												<TableCell align="left">{Shopping.product}</TableCell>
												<TableCell align="left">{Shopping.keyWord}</TableCell>
												<TableCell align="left">
													{Shopping.totalQuantity}
												</TableCell>
												<TableCell align="left">
													{Shopping.datePurchase.toString()}
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

export default ComprasCliente;
