import Navbar from "@/Navbar/Navbar";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
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
	IconButton,
	Container,
} from "@mui/material";
import { MenuData } from "models/Menu";
import React, { useState } from "react";
import "./Menu.css";

const rawMenu: MenuData[] = [
	{
		index: 1,
		brief: "Comprar un producto",
		description:
			"Realizar la compra de uno o varios productos en nuestra tienda en línea",
		keywords: ["comprar", "compra", "producto", "productos", "1"],
		action: null,
	},
	{
		index: 2,
		brief: "Calificar un producto",
		description:
			"Dar una calificación a uno de nuestros productos para ayudar a otros clientes en su decisión de compra",
		keywords: ["calificar", "calificación", "puntuar", "opinión", "2"],
		action: null,
	},
	{
		index: 3,
		brief: "Agendar una cita",
		description:
			"Programar una cita con uno de nuestros especialistas para recibir asesoría personalizada",
		keywords: ["agendar", "cita", "asesoría", "especialista", "3"],
		action: null,
	},
	{
		index: 4,
		brief: "Consultar disponibilidad",
		description:
			"Verificar la disponibilidad de un producto antes de realizar la compra",
		keywords: ["disponibilidad", "verificar", "consultar", "producto", "4"],
		action: null,
	},
	{
		index: 5,
		brief: "Programar entrega",
		description:
			"Seleccionar una fecha y hora para la entrega de los productos comprados",
		keywords: ["entrega", "programar", "fecha", "hora", "5"],
		action: null,
	},
];

const Menu = () => {
	/**
	 * Headers that will be displayed to the menu table
	 */
	const tableHeaders = [
		"Indice",
		"Opcion",
		"Descripción",
		"Palabras Clave",
		"Relacion",
	];

	/**
	 * Contains the menu info that will be displayed to the user
	 *
	 * // TODO: Delete "rawMenu" usage
	 */
	const [menu, setMenu] = useState<MenuData[]>(rawMenu);

	const isAdmin = true;

	async function deleteRawMenu(deletedRawMenuID: number) {
		// TODO: Display loader

		const newRawMenu = menu.filter(
			(option) => option.index !== deletedRawMenuID
		);

		// TODO: Call Option Menu deletion from DB
		setMenu(newRawMenu);
		// TODO: Hide loader
	}

	return (
		<>
			<Navbar />
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
					<h1>Menu</h1>
					<TableContainer
						sx={{ width: "650px", maxHeight: "400px" }}
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
								{menu.map((option) => (
									<TableRow key={option.index}>
										<TableCell align="left">{option.index}</TableCell>
										<TableCell align="left">{option.brief}</TableCell>
										<TableCell align="left">{option.description}</TableCell>
										<TableCell align="left">
											{option.keywords.join(", ")}
										</TableCell>
										<TableCell align="left">{option.action}</TableCell>
										{isAdmin && (
											<TableCell align="center">
												<IconButton>
													<Edit fontSize="inherit" />
												</IconButton>
												<IconButton onClick={() => deleteRawMenu(option.index)}>
													<DeleteForever fontSize="inherit" />
												</IconButton>
											</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<IconButton
						sx={{ alignSelf: "flex-start", fontSize: "40px", padding: "0px" }}
					>
						<AddCircle fontSize="inherit" />
					</IconButton>
				</Box>
			</Box>
		</>
	);
};

export default Menu;
