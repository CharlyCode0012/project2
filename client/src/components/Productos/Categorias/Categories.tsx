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
import React, { useState, useEffect, useRef } from "react";
import { Category } from "models/Category";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import CategoriesForm from "@/Productos/Categorias/CategoriesForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import { FileUpload } from "@/FileUpload";
import { useTheme } from "@mui/material/styles";

const Categories: React.FC = () => {
	const url = "/categories";
	const theme = useTheme();

	const { enqueueSnackbar } = useSnackbar();

	const [categories, setCategories] = useState<Category[]>([]);
	const selectedCategoryToEdit = useRef<Category | boolean>(false);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	const [hasDownloadedFile, setHasDownloadedFile] = useState(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["ID", "Nombre", "Descripción", "Estado"];

	const searchOptions = ["Estado", "Nombre"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isAdmin: boolean =
		typeUser === "admin" || typeUser === "vendedor" ? true : false;

	// console.log(isAdmin);
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

	function handleDownloadFile(hasDownloaded: boolean) {
		setHasDownloadedFile(hasDownloaded);
	}

	function createCategory() {
		selectedCategoryToEdit.current = false;
		openFormModal();
	}

	async function deleteCategory(category: Category) {
		const { category_name, id } = category;
		const deletedCategoryID: number = id;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		const endpoint = `${url}/${deletedCategoryID}`;
		if (isDelete) {
			try {
				console.log(`delete endpoint: ${endpoint}`);

				await instance.delete(endpoint);

				setCategories((categories) =>
					categories.filter((category) => category.id !== deletedCategoryID)
				);
				enqueueSnackbar(`Se elimino exitosamente ${category_name}`, {
					variant: "success",
				});

				handleDownloadFile(false);
			}
			catch {
				enqueueSnackbar(`Error al eliminar la ${category_name}`, {
					variant: "error",
				});
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
			case "Nombre":
				categories = (
					await instance.get<Category[]>(
						`/categories/categoryByName/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			case "Estado":
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
			enqueueSnackbar("Hubo un error al mostrar las categorias", {
				variant: "error",
			});
		}
	}

	return (
		<>
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
						<h1>Categorías</h1>
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
									handleDownloadFile={handleDownloadFile}
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
												<TableCell align="left">
													{category.category_name}
												</TableCell>
												<TableCell align="left">
													{category.description}
												</TableCell>
												<TableCell align="left">
													{category.state ? "Activada" : "Desactivada"}
												</TableCell>

												{isAdmin && (
													<TableCell align="center">
														<IconButton
															sx={{ color: theme.palette.text.primary }}
															onClick={() => handleEdit(category)}
														>
															<Edit fontSize="inherit" />
														</IconButton>
														<IconButton
															sx={{ color: theme.palette.text.primary }}
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
										color: theme.palette.text.primary,
									}}
									onClick={() => createCategory()}
								>
									<AddCircle fontSize="inherit" />
								</IconButton>
								<ExcelDownloadButton
									apiObjective="categories"
									onDownload={() => setHasDownloadedFile(true)}
								/>
								<FileUpload
									apiObjective="categories"
									onUpload={fetchCategories}
									disabled={!hasDownloadedFile}
								/>
							</Box>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default Categories;
