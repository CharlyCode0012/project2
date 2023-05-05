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
import "./Deliveries.css";
import { Delivery } from "models/Delivery";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import EntregasForm from "./EntregasForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import NavbarOrders from "@/Navbar/NavbarOrders";

const deliveries: React.FC = () => {
	const url = "/deliveries";

	const { enqueueSnackbar } = useSnackbar();

	const [confirmDeliveries, setConfirmDeliveries] = useState<Delivery[]>([]);
	const selectedDeliveryToEdit = useRef<Delivery | boolean>(false);

	const [showModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Headers that will be displayed to the table, not
	 * counting the last one which will be for admin
	 * purposes
	 */

	const tableHeaders = [
		"Folio",
		"Cliente",
		"Pendiente a pagar",
		"Lugar",
		"Fecha",
		"Estado",
	];

	const searchOptions = ["Lugar", "Fecha", "Estado"];

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
		// fetchOrders();
	}, []);

	async function fetchOrders() {
		try {
			const { data: deliveries } = await instance.get<Delivery[]>(url);
			setConfirmDeliveries(deliveries);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las catalogos", {
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
		fetchOrders();
	}

	function handleEdit(Delivery: Delivery) {
		selectedDeliveryToEdit.current = Delivery;
		openFormModal();
	}

	async function deleteDelivery(Delivery: Delivery) {
		const { folio, id } = Delivery;
		const deletedCatalogID: number = id;
		// TODO: Display loader
		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		const endpoint = `${url}/${deletedCatalogID}`;
		if (isDelete) {
			try {
				console.log(`delete endpoint: ${endpoint}`);

				const res = await instance.delete(endpoint);
				const dataCatalog = await res.data;

				if (dataCatalog?.err) {
					const message = dataCatalog?.statusText;
					const status = dataCatalog?.status;
					throw { message, status };
				}
				else {
					const newOrders = confirmDeliveries.filter(
						(order) => order.id !== deletedCatalogID
					);
					setConfirmDeliveries(newOrders);
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
			let deliveries: Delivery[];

			switch (filter) {
			case "Nombre":
				deliveries = (
					await instance.get<Delivery[]>(
						`/deliveries/catalogByName/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			case "Estado":
				deliveries = (
					await instance.get<Delivery[]>(
						`/deliveries/catalogByState/${search}`,
						{
							params: { order },
						}
					)
				).data;
				break;

			default:
				deliveries = (
					await instance.get<Delivery[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setConfirmDeliveries(deliveries);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los catalogos", {
				variant: "error",
			});
		}
	}

	return (
		<>
			<NavbarOrders />
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
						<h1>catalogos</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario catalogos"
							>
								<EntregasForm
									onSubmit={onCatalogSubmitted}
									OrderData={
										selectedDeliveryToEdit.current instanceof Object
											? selectedDeliveryToEdit.current
											: undefined
									}
								></EntregasForm>
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
									{!(confirmDeliveries?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										confirmDeliveries?.map((Delivery) => (
											<TableRow key={Delivery.id}>
												<TableCell align="left">{Delivery.folio}</TableCell>
												<TableCell align="left">{Delivery.id_client}</TableCell>
												<TableCell align="left">{Delivery.rest}</TableCell>;
												<TableCell align="left">{Delivery.place}</TableCell>
												<TableCell align="left">
													{Delivery.date_delivery.toString()}
												</TableCell>
												<TableCell align="left">
													{Delivery.state ? "Entregado" : "Sin Entregar"}
												</TableCell>
												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(Delivery)}>
															<Edit fontSize="inherit" />
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
								<ExcelDownloadButton apiObjective="deliveries" />
							</Box>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default deliveries;
