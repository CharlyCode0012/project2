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
	IconButton,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import "./Menu.css";
import { MenuData } from "models/Menu";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
// import Modal from "@/Modal/Modal";
// import ProductForm from "./ProductForm";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import { NavLink } from "react-router-dom";
import Navbar from "@/Navbar/Navbar";
import { User } from "models/User";
import { useReadLocalStorage } from "usehooks-ts";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import Modal from "@/Modal/Modal";
import MenuForm from "./MenuForm";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import { FileUpload } from "@/FileUpload";

const AnalisisClientes: React.FC = () => {
	const url = "/menus";

	const { enqueueSnackbar } = useSnackbar();

	const [menus, setMenus] = useState<MenuData[]>([]);
	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["#", "Título", "Texto", "Tipo"];

	const searchOptions = ["Texto"];

	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isAdmin: boolean =
		typeUser === "admin" || typeUser === "vendedor" ? true : false;

	const selectedMenuToEdit = useRef<MenuData | boolean>(false);

	/**
	 * Keeps track of wether the user has or hasn't downloaded the
	 * excel file, if not, user cannot upload another file
	 */
	const [hasDownloadedFile, setHasDownloadedFile] = useState(false);

	useEffect(() => {
		fetchMenu();
	}, []);

	function handleDownloadFile(hasDownloaded: boolean) {
		setHasDownloadedFile(hasDownloaded);
	}

	function onMenuSubmitted(wasAnUpdate: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasAnUpdate ? "Se actualizó con éxito" : "Se creo con éxito",
			{ variant: "success" }
		);
		fetchMenu();
	}

	function handleEdit(menu: MenuData) {
		selectedMenuToEdit.current = menu;
		openFormModal();
	}

	function createMenu() {
		selectedMenuToEdit.current = false;
		openFormModal();
	}

	async function deleteMenu(menu: MenuData) {
		const { name, id } = menu;
		const deletedMenuID: string = id;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		const endpoint = `${url}/${deletedMenuID}`;
		if (isDelete) {
			try {
				console.log(`delete endpoint: ${endpoint}`);
				await instance.delete(endpoint);
				enqueueSnackbar(`Se elimino exitosamente ${name}`, {
					variant: "success",
				});
				setMenus((menus) => menus.filter((menu) => menu.id !== deletedMenuID));
			}
			catch {
				enqueueSnackbar(`Error al eliminar la ${name}`, {
					variant: "error",
				});
			}
			handleDownloadFile(false);
		}
	}

	async function fetchMenu() {
		try {
			const { data: menus } = await instance.get<MenuData[]>(url);
			setMenus(menus);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los Menus", {
				variant: "error",
			});
		}
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let menus: MenuData[];

			switch (filter) {
			case "Texto":
				menus = (
					await instance.get<MenuData[]>(`/menus/menuByText/${search}`, {
						params: { order },
					})
				).data;
				break;

			default:
				menus = (
					await instance.get<MenuData[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setMenus(menus);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los menus", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<Navbar />
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
						<h1>Menus</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario Opcion Menu"
							>
								<MenuForm
									onSubmit={onMenuSubmitted}
									MenuData={
										selectedMenuToEdit.current instanceof Object
											? selectedMenuToEdit.current
											: undefined
									}
									handleDownloadFile={handleDownloadFile}
								></MenuForm>
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
									</TableRow>
								</TableHead>

								<TableBody>
									{!(menus?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										menus?.map((menu, index) => (
											<TableRow key={menu.id}>
												<TableCell align="left">{index + 1}</TableCell>
												<TableCell align="left">
													<NavLink
														to={`/menu/${menu.name}/${menu.id}`}
														style={{ color: "inherit", textDecoration: "none" }}
													>
														{menu.name}
													</NavLink>
												</TableCell>
												<TableCell align="left">{menu.answer}</TableCell>
												<TableCell align="left">
													{menu.principalMenu === false ? "Submenu" : "Menu"}
												</TableCell>
												{isAdmin && (
													<TableCell align="left">
														<IconButton onClick={() => handleEdit(menu)}>
															<Edit fontSize="inherit" />
														</IconButton>
														{!menu.principalMenu && (
															<IconButton onClick={() => deleteMenu(menu)}>
																<DeleteForever fontSize="inherit" />
															</IconButton>
														)}
													</TableCell>
												)}
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
							{isAdmin && (
								<IconButton
									sx={{
										alignSelf: "flex-start",
										fontSize: "40px",
										padding: "0px",
									}}
									onClick={() => createMenu()}
								>
									<AddCircle fontSize="inherit" />
								</IconButton>
							)}
							<ExcelDownloadButton
								apiObjective="menus"
								onDownload={() => setHasDownloadedFile(true)}
							/>
							<FileUpload
								apiObjective="menus"
								onUpload={fetchMenu}
								disabled={!hasDownloadedFile}
							/>
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default AnalisisClientes;
