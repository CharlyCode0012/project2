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
import { MenuData, MenuOption } from "models/Menu";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import MenuForm from "./MenuOptionForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import Navbar from "@/Navbar/Navbar";
import { FileUpload } from "@/FileUpload";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const MenuOptions: React.FC = () => {
	const url = "/menu_options";
	const theme = useTheme();

	const { enqueueSnackbar } = useSnackbar();

	const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
	const selectedMenuOptionToEdit = useRef<MenuOption | boolean>(false);
	const { menuTitle, menuID } = useParams();

	const [hasDownloadedFile, setHasDownloadedFile] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = [
		"#",
		"Opcion",
		"Palabra Clave",
		"Accion",
		"Respuesta",
		"Referencia",
	];

	const searchOptions = ["Palabra clave"];

	/**
	 * Determines if some admin action buttons will be
	 * displayed in the table too
	 */
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isSeller: boolean = typeUser === "vendedor" ? true : false;

	// console.log(isSeller);
	// TODO:

	useEffect(() => {
		fetchMenuOptions();
	}, []);

	async function fetchMenuOptions() {
		setMenuOptions([]);
		try {
			const { data: menuOptions } = await instance.get<MenuOption[]>(url, {
				params: { order: "ASC", menuID },
			});
			setMenuOptions(menuOptions);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las opciones", {
				variant: "error",
			});
		}
	}

	function onProductSubmitted(wasUpdates: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasUpdates ? "Se actualizo exitosamente" : "Se creo con exito",
			{
				variant: "success",
			}
		);
		fetchMenuOptions();
	}

	function handleEdit(optionMenu: MenuOption) {
		selectedMenuOptionToEdit.current = optionMenu;
		openFormModal();
	}

	async function createProduct() {
		selectedMenuOptionToEdit.current = false;
		openFormModal();
	}

	async function deleteProduct(optionMenu: MenuOption) {
		const { keywords, id } = optionMenu;
		const deletedProductID: string = id;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${keywords}`
		);

		const endpoint = `${url}/${deletedProductID}`;
		if (isDelete) {
			try {
				console.log(`delete endpoint: ${endpoint}`);
				await instance.delete(endpoint);
				enqueueSnackbar(`Se elimino exitosamente ${keywords}`, {
					variant: "success",
				});
				setMenuOptions((menuOptions) =>
					menuOptions.filter((optionMenu) => optionMenu.id !== deletedProductID)
				);
			}
			catch {
				enqueueSnackbar(`Error al eliminar la ${keywords}`, {
					variant: "error",
				});
			}
			handleDownloadFile(false);
		}
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let MenuOptions: MenuOption[];

			switch (filter) {
			case "Palabra clave":
				MenuOptions = (
					await instance.get<MenuOption[]>("/menu_options/searchByKeyWord", {
						params: { order, search, menuID },
					})
				).data;
				break;

			default:
				MenuOptions = (
					await instance.get<MenuOption[]>(url, {
						params: { order, menuID },
					})
				).data;
				break;
			}

			setMenuOptions(MenuOptions);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las opciones", {
				variant: "error",
			});
		}
	}

	function handleDownloadFile(hasDownloaded: boolean) {
		setHasDownloadedFile(hasDownloaded);
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
						<h1>{menuTitle}</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario Opcion Menu"
							>
								<MenuForm
									onSubmit={onProductSubmitted}
									OptionData={
										selectedMenuOptionToEdit.current instanceof Object
											? selectedMenuOptionToEdit.current
											: undefined
									}
									menuID={menuID}
									handleDownloadFile={handleDownloadFile}
								></MenuForm>
							</Modal>
						)}
						<TableContainer
							sx={{ width: "1100px", maxHeight: "400px" }}
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

										{isSeller && <TableCell />}
									</TableRow>
								</TableHead>

								<TableBody>
									{!(menuOptions?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										menuOptions?.map((optionMenu: MenuOption, index) => (
											<TableRow key={optionMenu.id}>
												<TableCell align="left">{index + 1}</TableCell>
												<TableCell align="left">{optionMenu.option}</TableCell>
												<TableCell align="left">
													{optionMenu.keywords}
												</TableCell>
												<TableCell align="left">
													{optionMenu.action_type}
												</TableCell>
												<TableCell align="left">{optionMenu.answer}</TableCell>
												<TableCell align="left">
													{optionMenu.referenceName}
												</TableCell>
												{isSeller && (
													<TableCell align="center">
														<IconButton
															sx={{ color: theme.palette.text.primary }}
															onClick={() => handleEdit(optionMenu)}
														>
															<Edit fontSize="inherit" />
														</IconButton>
														<IconButton
															sx={{ color: theme.palette.text.primary }}
															onClick={() => deleteProduct(optionMenu)}
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

						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								gap: "10px",
							}}
						>
							{isSeller && (
								<>
									<IconButton
										sx={{
											alignSelf: "flex-start",
											fontSize: "40px",
											padding: "0px",
											color: theme.palette.text.primary,
										}}
										onClick={() => createProduct()}
									>
										<AddCircle fontSize="inherit" />
									</IconButton>
									<ExcelDownloadButton
										apiObjective={`menu_options:${menuID}`}
										onDownload={() => setHasDownloadedFile(true)}
									/>
									<FileUpload
										apiObjective={`menu_options:${menuID}`}
										onUpload={fetchMenuOptions}
										disabled={!hasDownloadedFile}
									/>
								</>
							)}
						</Box>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default MenuOptions;
