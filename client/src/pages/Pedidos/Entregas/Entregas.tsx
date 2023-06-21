import { Edit } from "@mui/icons-material";
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
		"Estado de Pago",
		"Pendiente a pagar",
		"Producto(s)",
		"Lugar",
		"Fecha",
		"Entregado",
	];

	const searchOptions = ["Estado", "Fecha", "Folio", "Lugar"];

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
		fetchDeliveries();
	}, []);

	async function fetchDeliveries() {
		try {
			const { data: deliveries } = await instance.get<Delivery[]>(url);
			setConfirmDeliveries(deliveries);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar las entregas", {
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
		fetchDeliveries();
	}

	function handleEdit(Delivery: Delivery) {
		selectedDeliveryToEdit.current = Delivery;
		openFormModal();
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let deliveries: Delivery[];

			switch (filter) {
			case "Estado":
				deliveries = (
					await instance.get<Delivery[]>("/deliveries/searchByState", {
						params: { order, search },
					})
				).data;
				break;

			case "Fecha":
				deliveries = (
					await instance.get<Delivery[]>("/deliveries/searchByDate", {
						params: { order, search },
					})
				).data;

				break;

			case "Folio":
				deliveries = (
					await instance.get<Delivery[]>("/deliveries/searchByFolio", {
						params: { order, search },
					})
				).data;

				break;

			case "Lugar":
				deliveries = (
					await instance.get<Delivery[]>("/deliveries/searchByPlace", {
						params: { order, search },
					})
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
			enqueueSnackbar("Hubo un error al mostrar las entregas", {
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
						<h1>Entregas</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario entregas"
							>
								<EntregasForm
									onSubmit={onCatalogSubmitted}
									DeliveryData={
										selectedDeliveryToEdit.current instanceof Object
											? selectedDeliveryToEdit.current
											: undefined
									}
								></EntregasForm>
							</Modal>
						)}
						<TableContainer
							sx={{ width: "1000px", maxHeight: "400px" }}
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
										confirmDeliveries?.map((delivery) => (
											<TableRow key={delivery.id}>
												<TableCell align="left">{delivery.folio}</TableCell>
												<TableCell align="left">{delivery.id_client}</TableCell>
												<TableCell align="left">
													{delivery.order_state}
												</TableCell>
												<TableCell align="left">{delivery.rest}</TableCell>
												<TableCell align="left">{delivery.key_word}</TableCell>
												<TableCell align="left">{delivery.place}</TableCell>
												<TableCell align="left">
													{delivery.date_delivery
														? delivery.date_delivery.toString()
														: ""}
												</TableCell>
												<TableCell align="left">
													{delivery.state ? "Entregado" : "Sin Entregar"}
												</TableCell>
												{isAdmin && (
													<TableCell align="center">
														<IconButton onClick={() => handleEdit(delivery)}>
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
								<ExcelDownloadButton
									apiObjective="deliveries"
									onDownload={() => {}}
								/>
							</Box>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default deliveries;
