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
import "./Orders.css";
import { Order } from "models/Order";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import Modal from "@/Modal/Modal";
import OrdersForm from "./OrdersForm";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import NavbarOrders from "@/Navbar/NavbarOrders";
import { useTheme } from "@mui/material/styles";

const orders: React.FC = () => {
	const url = "/orders";

	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();
	const [confirmOrders, setConfirmOrders] = useState<Order[]>([]);
	const selectedOrderToEdit = useRef<Order | boolean>(false);

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
		"Fecha Orden",
		"Total",
		"Monto Pagado",
		"Cliente",
		"Lugar",
		"Tarjeta",
		"Estado",
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
		fetchOrders();
	}, []);

	async function fetchOrders() {
		try {
			const { data: orders } = await instance.get<Order[]>(url, {
				params: { order: "ASC" },
			});
			setConfirmOrders(orders);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los pedidos", {
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

	function handleEdit(Order: Order) {
		selectedOrderToEdit.current = Order;
		openFormModal();
	}

	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let orders: Order[];

			switch (filter) {
			case "Lugar":
				orders = (
					await instance.get<Order[]>("/orders/searchByPlace", {
						params: { order, search },
					})
				).data;
				break;

			case "Estado":
				orders = (
					await instance.get<Order[]>("/orders/searchByState", {
						params: { order, search },
					})
				).data;

				console.log(orders);
				break;
			case "Fecha":
				orders = (
					await instance.get<Order[]>("/orders/searchByDate", {
						params: { order, search },
					})
				).data;
				break;

			case "Folio":
				orders = (
					await instance.get<Order[]>("/orders/searchByFolio", {
						params: { order, search },
					})
				).data;
				break;

			default:
				orders = (
					await instance.get<Order[]>(url, {
						params: { order },
					})
				).data;
				break;
			}

			setConfirmOrders(orders);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los pedidos", {
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
						<h1>Pedidos</h1>
						{showModal && (
							<Modal
								open={showModal}
								handleOpen={setShowModal}
								title="Formulario pedidos"
							>
								<OrdersForm
									onSubmit={onCatalogSubmitted}
									OrderData={
										selectedOrderToEdit.current instanceof Object
											? selectedOrderToEdit.current
											: undefined
									}
								></OrdersForm>
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

										{isAdmin && <TableCell />}
									</TableRow>
								</TableHead>

								<TableBody>
									{!(confirmOrders?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										confirmOrders?.map((Order) => (
											<TableRow key={Order.id}>
												<TableCell align="left">{Order.folio}</TableCell>
												<TableCell align="left">
													{new Date(Order.date_order)
														.toISOString()
														.substring(0, 10)}
												</TableCell>
												<TableCell align="left">{Order.total}</TableCell>
												<TableCell align="left">{Order.amount}</TableCell>
												<TableCell align="left">{Order.id_client}</TableCell>
												<TableCell align="left">{Order.place}</TableCell>
												<TableCell align="left">{Order.payment}</TableCell>
												<TableCell align="left">{Order.state}</TableCell>
												{isAdmin && (
													<TableCell align="center">
														<IconButton
															sx={{ color: theme.palette.text.primary }}
															onClick={() => handleEdit(Order)}
														>
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
							></Box>
						)}
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default orders;
