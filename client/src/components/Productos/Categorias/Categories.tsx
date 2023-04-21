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
import React, { useState, useContext, useEffect, useRef } from "react";
import "./Categories.css";
import { Category } from "models/Category";
import Loading from "@/Loading/Loading";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import CategoriesForm from "@/Productos/Categorias/CategoriesForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";

const Categories: React.FC = () => {
	const url = "/categories";
	const path = "/productos/categorias";
	const user: User | null = useReadLocalStorage<User>("log_in");

	const { enqueueSnackbar } = useSnackbar();

	const navigate = useNavigate();

	const [categories, setCategories] = useState<Category[]>([]);
	const selectedCategoryToEdit = useRef<Category | boolean>(false);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["ID", "Nombre", "Estado"];

	const searchOptions = ["Name", "State"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */
	const isAdmin = user?.type_use === "admin" ? true : false;
	//console.log(isAdmin);
	// TODO:

	useEffect(() => {
		fetchCategories();
	}, []);

	async function fetchCategories() {
		try {
			const { data: categories } = await instance.get<Category[]>(url);
			setCategories(categories);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las categorias", {
				variant: "error",
			});
		}
	}

	function onCategorySubmitted(wasUpdates: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasUpdates ? "Se actualizo exitosamente" : "Se creo con exito",
			{
				variant: "success",
			}
		);
		fetchCategories();
	}

	function handleEdit(category: Category) {
		selectedCategoryToEdit.current = category;
		openFormModal();
	}

	async function createCategory() {
		selectedCategoryToEdit.current = false;
		openFormModal();
	}

	async function deleteCategory(category: Category) {
		const { name, id } = category;
		const deletedCategoryID: number = id;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		const endpoint = `${url}/${deletedCategoryID}`;
		if (isDelete) {
			try {
				console.log(`delete endpoint: ${endpoint}`);

				const res = await instance.delete(endpoint);
				const dataCategory = await res.data;

				if (dataCategory?.err) {
					const message = dataCategory?.statusText;
					const status = dataCategory?.status;
					throw { message, status };
				}
				else {
					const newCategories = categories.filter(
						(categoryD) => categoryD.id !== deletedCategoryID
					);
					setCategories(newCategories);
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
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let categories: Category[];

			switch (filter) {
			case "Name":
				categories = (
					await instance.get<Category[]>(
						`/categories/getCategoryByName/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			case "State":
				categories = (
					await instance.get<Category[]>(
						`/categories/categoryByState/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			default:
				categories = (
					await instance.get<Category[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setCategories(categories);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los metodos de pago", {
				variant: "error",
			});
		}
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
						<SearchAppBar
							searchOptions={searchOptions}
							onSubmitSearch={onSubmitSearch}
						/>
						<h1>Categorias</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario Categorias"
							>
								<CategoriesForm
									onSubmit={onCategorySubmitted}
									categoryData={
										selectedCategoryToEdit.current instanceof Object
											? selectedCategoryToEdit.current
											: undefined
									}
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
															onClick={() => deleteCategory(category)}
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
						{isAdmin && (
							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									gap: "10px",
								}}
							>
								<IconButton
									sx={{
										alignSelf: "flex-start",
										fontSize: "40px",
										padding: "0px",
									}}
									onClick={() => createCategory()}
								>
									<AddCircle fontSize="inherit" />
								</IconButton>

								<ExcelDownloadButton apiObjective="categories" />
							</Box>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Categories;
