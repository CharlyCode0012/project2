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
} from "@mui/material";
import React, { useState } from "react";
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
	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */
	const tableHeaders = ["ID", "Nombre", "Estado"];

	/**
	 * Contains all the categories that will be displayed to the user
	 *
	 * // TODO: Delete "rawCategories" usage
	 */
	const [categories, setCategories] = useState(rawCategories);

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */
	const isAdmin = true;

	return (
		<div className="categories">
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
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

								{isAdmin && <TableCell />}
							</TableRow>
						</TableHead>

						<TableBody>
							{categories.map((category) => (
								<TableRow key={category.id}>
									<TableCell align="left">{category.id}</TableCell>
									<TableCell align="left">{category.name}</TableCell>
									<TableCell align="left">
										{category.state ? "Activada" : "Desactivada"}
									</TableCell>

									{isAdmin && (
										<TableCell align="center">
											<IconButton>
												<Edit fontSize="inherit" />
											</IconButton>
											<IconButton>
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
		</div>
	);
};

export default Categories;
