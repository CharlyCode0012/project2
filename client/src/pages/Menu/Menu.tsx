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
import DisplayedMenu from "./DisplayedMenu";

const toyStoreMenu: MenuData = {
	id: "1",
	title: "Menu Principal",
	instruction: "¿Qué acción desea realizar?",
	options: [
		{
			id: "1",
			index: 1,
			brief: "Ver categorías de juguetes",
			description:
				"Muestra un menú con las diferentes categorías de juguetes disponibles en la tienda.",
			keywords: ["categorías", "juguetes"],
			actionType: "menu",
			action: {
				id: "2",
				title: "Categorías de juguetes",
				instruction: "¿Qué categoría de juguetes te interesa?",
				options: [
					{
						id: "1",
						index: 1,
						brief: "Muñecos y figuras de acción",
						description:
							"Muestra una lista de muñecos y figuras de acción disponibles en la tienda.",
						keywords: ["muñecos", "figuras", "acción"],
						actionType: "catalog",
						action: {
							id: "1",
							name: "Muñecos y figuras de acción",
							description:
								"Encuentra a tus personajes favoritos de películas y series en forma de muñecos y figuras de acción.",
							products: [
								"Spiderman",
								"Iron Man",
								"Batman",
								"Superman",
								"Harry Potter",
							],
						},
					},
					{
						id: "2",
						index: 2,
						brief: "Juegos de mesa",
						description:
							"Muestra una lista de juegos de mesa disponibles en la tienda.",
						keywords: ["juegos", "mesa"],
						actionType: "catalog",
						action: {
							id: "2",
							name: "Juegos de mesa",
							description:
								"Diviértete en familia o con amigos con nuestra selección de juegos de mesa para todas las edades.",
							products: ["Monopoly", "Scrabble", "Jenga", "Risk", "Catán"],
						},
					},
					{
						id: "3",
						index: 3,
						brief: "Peluches",
						description:
							"Muestra una lista de peluches disponibles en la tienda.",
						keywords: ["peluches"],
						actionType: "catalog",
						action: {
							id: "3",
							name: "Peluches",
							description:
								"Abraza a tus personajes favoritos en forma de peluche y tenlos siempre contigo.",
							products: [
								"Pikachu",
								"Sonic",
								"Minions",
								"Doraemon",
								"Mickey Mouse",
							],
						},
					},
				],
			},
		},
		{
			id: "2",
			index: 2,
			brief: "Ver promociones",
			description:
				"Muestra una lista de las promociones actuales en la tienda.",
			keywords: ["promociones"],
			actionType: "link",
			action: "https://www.toy-store.com/promociones",
		},
		{
			id: "3",
			index: 3,
			brief: "Ver carrito de compras",
			description:
				"Muestra los productos que has añadido al carrito de compras.",
			keywords: ["carrito", "compras"],
			actionType: "message",
			action:
				"Gracias por visitar la tienda. ¡Esperamos verte pronto de nuevo!",
		},
	],
};

const Menu = () => {
	const isAdmin = true;

	return (
		<>
			<Navbar />

			<Container
				sx={{
					width: "600px",
					marginTop: "20px",
					marginBottom: "20px",
				}}
			>
				<h1>Menú</h1>

				<Paper
					elevation={4}
					sx={{
						display: "flex",
						flexDirection: "column",
						padding: "20px",
						gap: "20px",
					}}
				>
					<DisplayedMenu data={toyStoreMenu} />
				</Paper>
			</Container>
		</>
	);
};

export default Menu;
