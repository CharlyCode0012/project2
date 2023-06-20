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
import { Catalog } from "models/Catalog";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import CatalogsForm from "./CatalogsForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import { FileUpload } from "@/FileUpload";

const Catalogs: React.FC = () => {
	const url = "/catalogs";

	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = ["ID", "Nombre", "Descripcion", "Estado"];

	const searchOptions = ["Nombre", "Estado"];

	const [Catalogs, setCatalogs] = useState<Catalog[]>([]);
	const selectedCatalogToEdit = useRef<Catalog | boolean>(false);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	const [hasDownloadedFile, setHasDownloadedFile] = useState(false);

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
		fetchCatalogs();
	}, []);

	async function fetchCatalogs() {
		try {
			const { data: Catalogs } = await instance.get<Catalog[]>(url);
			setCatalogs(Catalogs);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los catalogos", {
				variant: "error",
			});
		}
	}

	function onCatalogSubmitted(wasUpdates: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasUpdates ? "Se actualizo exitosamente" : "Se creo con exito",
			{
				variant: "success",
			}
		);
		fetchCatalogs();
	}

	function handleEdit(Catalog: Catalog) {
		selectedCatalogToEdit.current = Catalog;
		openFormModal();
	}

	function handleDownloadFile(hasDownloaded: boolean) {
		setHasDownloadedFile(hasDownloaded);
	}

	async function createCatalog() {
		selectedCatalogToEdit.current = false;
		openFormModal();
	}

	async function deleteCatalog(deleteCatalog: Catalog) {
		const { name, id } = deleteCatalog;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		const endpoint = `${url}/${id}`;
		if (isDelete) {
			try {
				await instance.delete(endpoint);
				enqueueSnackbar(`Se elimino exitosamente ${name}`, {
					variant: "success",
				});
				setCatalogs((catalogs) =>
					catalogs.filter((catalog) => catalog.id !== deleteCatalog.id)
				);
				handleDownloadFile(false);
			}
			catch {
				enqueueSnackbar(`Error al eliminar la ${name}`, { variant: "error" });
			}
		}
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let Catalogs: Catalog[];
			let state;
			switch (filter) {
			case "Nombre":
				Catalogs = (
					await instance.get<Catalog[]>("/catalogs/searchByName", {
						params: { order, search },
					})
				).data;
				break;

			case "Estado":
				state = search.toLowerCase() === "activada" ? 1 : 0;
				Catalogs = (
					await instance.get<Catalog[]>("/catalogs/searchByState", {
						params: { order, search: state },
					})
				).data;
				break;

			default:
				Catalogs = (
					await instance.get<Catalog[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setCatalogs(Catalogs);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los catalogos", {
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
						<h1>catalogos</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario catalogos"
							>
								<CatalogsForm
									onSubmit={onCatalogSubmitted}
									CatalogData={
										selectedCatalogToEdit.current instanceof Object
											? selectedCatalogToEdit.current
											: undefined
									}
									handleDownloadFile={handleDownloadFile}
								></CatalogsForm>
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
									{!(Catalogs?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										Catalogs?.map((Catalog) => (
											<TableRow key={Catalog.id}>
												<TableCell align="left">{Catalog.id}</TableCell>
												<TableCell align="left">{Catalog.name}</TableCell>
												<TableCell align="left">
													{Catalog.description}
												</TableCell>
												<TableCell align="left">
													{Catalog.state ? "Activada" : "Desactivada"}
												</TableCell>
												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(Catalog)}>
															<Edit fontSize="inherit" />
														</IconButton>
														<IconButton onClick={() => deleteCatalog(Catalog)}>
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
									onClick={() => createCatalog()}
								>
									<AddCircle fontSize="inherit" />
								</IconButton>
								<ExcelDownloadButton
									apiObjective="catalogs"
									onDownload={() => setHasDownloadedFile(true)}
								/>
								<FileUpload
									apiObjective="catalogs"
									onUpload={fetchCatalogs}
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

export default Catalogs;
