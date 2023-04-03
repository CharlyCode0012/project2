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
import React, { useState } from "react";
import "./Categories.css";

import { Category } from "models/Category";
import Loading from "@/Loading/Loading";
import { SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import CategoriesForm from "./CategoriesForm";

const rawCategories: Category[] = [
	/* 	{ id: "1234567890", name: "Hogar", state: true },
	{ id: "2345678901", name: "Mascotas", state: false },
	{ id: "3456789012", name: "Limpieza", state: true },
	{ id: "4567890123", name: "Electrónica", state: false },
	{ id: "5678901234", name: "Bebidas", state: true },
	{ id: "6789012345", name: "Frutas y verduras", state: false },
	{ id: "7890123456", name: "Panadería", state: true },
	{ id: "8901234567", name: "Carnes", state: false },
	{ id: "9012345678", name: "Juguetes", state: true },
	{ id: "1234567891", name: "Higiene personal", state: false }, */
];

const Categories: React.FC = () => {
	const [isOpen, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>(rawCategories);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["ID", "Nombre", "Estado"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */

	const isAdmin = true;

	function handleOpen(op: boolean): void {
		setOpen(op);
	}

	async function createCategory() {
		handleOpen(true);
	}

	async function deleteCategory(deletedCategoryID: number) {
		// TODO: Display loader

		const newCategories = categories.filter(
			(category) => category.id !== deletedCategoryID
		);

		// TODO: Call category deletion from DB
		setCategories(newCategories);

		// TODO: Hide loader
	}

	return (
		<>
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
						<SearchAppBar />
						<h1>Categorias</h1>
						{isOpen && (
							<Modal
								open={isOpen}
								handleOpen={handleOpen}
								title="Formulario Categorias"
							>
								<CategoriesForm handleOpen={handleOpen}></CategoriesForm>
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
													<IconButton
														onClick={() => deleteCategory(category.id)}
													>
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
							onClick={() => createCategory()}
						>
							<AddCircle fontSize="inherit" />
						</IconButton>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Categories;
