import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from "@mui/material";
import React from "react";
import "./Categories.css";

const rawCategories = [
	{ id: 1234567890, name: "Hogar", state: 1 },
	{ id: 2345678901, name: "Mascotas", state: 0 },
	{ id: 3456789012, name: "Limpieza", state: 1 },
	{ id: 4567890123, name: "Electrónica", state: 0 },
	{ id: 5678901234, name: "Bebidas", state: 1 },
	{ id: 6789012345, name: "Frutas y verduras", state: 0 },
	{ id: 7890123456, name: "Panadería", state: 1 },
	{ id: 8901234567, name: "Carnes", state: 0 },
	{ id: 9012345678, name: "Juguetes", state: 1 },
	{ id: 1234567891, name: "Higiene personal", state: 0 },
];

const Categories: React.FC = () => {
	const tableHeaders = ["ID", "Nombre", "Estado"];

	return (
		<div className="categories">
			<h1>Categorias</h1>

			<TableContainer
				sx={{ width: "600px", maxHeight: "400px" }}
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
						{rawCategories.map((category) => (
							<TableRow key={category.id}>
								<TableCell align="left">{category.id}</TableCell>
								<TableCell align="left">{category.name}</TableCell>
								<TableCell align="left">
									{category.state ? "Activada" : "Desactivada"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default Categories;
