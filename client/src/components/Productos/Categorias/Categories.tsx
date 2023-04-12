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
import { useNavigate } from "react-router-dom";
import { Search } from "models/Search";

const rawCategories: Category[] = [];

const cookie = new Cookies();
const url = "/categories";
const path = "/productos/categorias";

const Categories: React.FC = () => {
	const [isOpen, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>(rawCategories);
	const [editCategory, setEditCategory] = useState<Category | undefined>(
		undefined
	);
	const navigate = useNavigate();
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

	// TODO:

	function handleOpen(op: boolean): void {
		setOpen(op);
	}

	function handleEdit(category: Category) {
		setEditCategory(category);
		handleOpen(true);
	}

	async function createCategory() {
		setEditCategory(undefined);
		handleOpen(true);
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
			const newCategories = categories.filter(
				(categoryD) => categoryD.id !== deletedCategoryID
			);
			setCategories(newCategories);

			try {
				console.log(`delete endpoint: ${endpoint}`);

				const res = await instance.delete(endpoint);
				const dataCategory = await res.data;

				if (dataCategory?.err) {
					const message = dataCategory?.statusText;
					const status = dataCategory?.status;
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

		// TODO: Hide loader
	}

	async function getCategories() {
		try {
			const response = await instance.get<ServerResponse>(url);
			let dataCategories = await response?.data;

			if (!dataCategories?.err) {
				DeleteProps(dataCategories?.success, ["createdAt", "updatedAt"]);

				setCategories(dataCategories?.success);
				// console.log(dataCategories?.success);
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

	async function getCategoriesSearch(endpoint: string, order: string) {
		// console.log("Url: ", endpoint);
		try {
			const response = await instance.get<ServerResponse>(endpoint, {
				params: { order: order },
			});
			let dataCategories = await response?.data;

			if (!dataCategories?.err) {
				DeleteProps(dataCategories?.success, ["createdAt", "updatedAt"]);

				setCategories(dataCategories?.success);
				// console.log(dataCategories?.success);
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

	function validationSearch(search: string, order: string): Search {
		const regexTest: string = search ?? "";
		const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
		const optionsState = ["ACTIVADA", "ACTIVADO", "DESACTIVADA", "DESACTIVADO"];

		const searchUperCase = search?.trim().toUpperCase();
		let isActivated = false;

		if (
			searchUperCase == optionsState[0] ||
			searchUperCase == optionsState[1]
		) {
			isActivated = true;
			navigate({
				pathname: path + "/getCategoryByState/" + search,
				search: "?order=" + order,
			});
			return {
				text: "state",
				url: `${url}/getCategoryByState/${isActivated}`,
			};
		}
		else if (
			searchUperCase == optionsState[2] ||
			searchUperCase == optionsState[3]
		) {
			isActivated = false;
			navigate({
				pathname: path + "/getCategoryByState/" + search,
				search: "?order=" + order,
			});
			return {
				text: "state",
				url: `${url}/getCategoryByState/${isActivated}`,
			};
		}

		if (regexName.test(regexTest)) {
			navigate({
				pathname: path + "/getCategoryByName/" + search,
				search: "?order=" + order,
			});
			return {
				text: "name",
				url: `${url}/getCategoryByName/${search}`,
			};
		}

		return { text: "", url: "" };
	}

	async function onSubmitSearch(search: string | null, order: string | null) {
		const searchValue: string = search ?? "";
		const orderValue: string = order ?? "ASC";
		if (search === "") {
			navigate({
				pathname: path,
				search: "?order=" + order,
			});
			return getCategories();
		}

		const typeGet: Search = validationSearch(searchValue, orderValue);
		return getCategoriesSearch(typeGet.url, orderValue);
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
						<SearchAppBar onSubmitSearch={onSubmitSearch} />
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
									url={url}
									categories={categories}
									setCategories={setCategories}
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
