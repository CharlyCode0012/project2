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
import React, { useState, useContext, useEffect } from "react";
import "./Categories.css";
import { Category } from "models/Category";
import Loading from "@/Loading/Loading";
import { SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import CategoriesForm from "@/Productos/Categorias/CategoriesForm";
import { useReadLocalStorage } from "usehooks-ts";
import Cookies from "universal-cookie";
import { User } from "models/User";
import { instance } from "helper/API";
import { ServerResponse, initialSereverResponse } from "models/ServerResponse";
import { DeleteProps } from "helper/DeleteProps";

const rawCategories: Category[] = [];

const cookie = new Cookies();
const url = "/categories";

const Categories: React.FC = () => {
	const [isOpen, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>(rawCategories);
	const [editCategory, setEditCategory] = useState<Category | undefined>(
		undefined
	);
	const user: User =
		useReadLocalStorage<User>("log_in") ?? cookie.get<User>("user");

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

	function handleCategory(data: Category[]) {
		setCategories(data);
	}

	async function createCategory() {
		setEditCategory(undefined);
		handleOpen(true);
	}

	function handleEdit(category: Category) {
		setEditCategory(category);
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

	async function getCategories() {
		try {
			const response = await instance.get<ServerResponse>(url);
			let dataCategories = await response?.data;
			console.log(dataCategories);

			if (!dataCategories?.err) {
				DeleteProps(dataCategories?.success, ["createdAt", "updatedAt"]);

				setCategories(dataCategories?.success);
				console.log(categories);
				dataCategories = initialSereverResponse;
			}
			else {
				const message = dataCategories?.statusText;
				const status = dataCategories?.status;
				throw { message, status };
			}
		}
		catch (error: any) {
			alert(
				`Descripcion del error: ${error.message}\nEstado: ${
					error?.status ?? 500
				}`
			);
		}
	}

	useEffect(() => {
		getCategories();
	}, []);

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
								<CategoriesForm
									handleOpen={handleOpen}
									dataToEdit={editCategory}
									endpoint={url}
									categories={categories}
									setCategories={handleCategory}
								></CategoriesForm>
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
									{!(categories?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										categories?.map((category) => (
											<TableRow key={category.id}>
												<TableCell align="left">{category.id}</TableCell>
												<TableCell align="left">{category.name}</TableCell>
												<TableCell align="left">
													{category.state ? "Activada" : "Desactivada"}
												</TableCell>

												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(category)}>
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
										))
									)}
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
