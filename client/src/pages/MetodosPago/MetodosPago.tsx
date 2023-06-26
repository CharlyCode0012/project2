import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/Navbar/Navbar";
import {
	Box,
	Container,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from "@mui/material";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import { PaymentMethod } from "models/PaymentsMethod";
import Modal from "@/Modal/Modal";
import { useSnackbar } from "notistack";
import { instance } from "helper/API";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";
import PaymentMethodForm from "./MetodosPagoForm";
import ExcelDownloadButton from "@/ExcelDownloadButton/ExcelDownloadButton";
import { FileUpload } from "@/FileUpload";
import { User } from "models/User";
import { useReadLocalStorage } from "usehooks-ts";

const LugaresEntrega = () => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Headers that will be displayed to the table
	 */
	const tableHeaders = [
		"ID",
		"Titular",
		"CLABE",
		"No. Tarjeta",
		"Banco",
		"Lugares para depositar",
	];

	/**
	 * Options that the user can select to filter the data
	 * that is displayed in the table
	 */
	const searchOptions = ["ID", "Titular", "CLABE", "No. Tarjeta", "Banco"];

	/**
	 * Saves the payment methods stored in the DB
	 * and displays them in the table
	 */
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

	/**
	 * Determines if the method's modal will be shown
	 * (only when user creates or edits a payment method)
	 */
	const [showFormModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Keeps track of the method that the user wanted to
	 * edit (stays null when user creates a new payment method)
	 */
	const selectedMethodToEdit = useRef<PaymentMethod | boolean>(false);

	/**
	 * Keeps track of wether the user has or hasn't downloaded the
	 * excel file, if not, user cannot upload another file
	 */
	const [hasDownloadedFile, setHasDownloadedFile] = useState(false);

	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isAdmin: boolean =
		typeUser === "admin" || typeUser === "vendedor" ? true : false;

	/**
	 * When rendered, payment methods are obtained from DB and displayed in the table
	 */
	useEffect(() => {
		fetchPaymentMethods();
	}, []);

	/**
	 * Fetches the payment methods from the DB
	 * Shows a notification to user when something went wrong
	 */
	async function fetchPaymentMethods() {
		try {
			const { data: paymentMethods } = await instance.get<PaymentMethod[]>(
				"/payment_methods"
			);
			setPaymentMethods(paymentMethods);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los metodos de pago", {
				variant: "error",
			});
		}
	}

	/**
	 * Gets called when a payment method was created or edited, closes the modal,
	 * notifies the user and refreshes the table
	 *
	 * @param wasAnUpdate changes the notification message depending on the action (created / edited)
	 */
	function onPaymentMethodSubmitted(wasAnUpdate: boolean) {
		closeFormModal();
		enqueueSnackbar(
			wasAnUpdate ? "Se actualizó con éxito" : "Se creo con éxito",
			{ variant: "success" }
		);
		fetchPaymentMethods();
	}

	function handleDownloadFile(hasDownloaded: boolean) {
		setHasDownloadedFile(hasDownloaded);
	}

	/**
	 * When called, establishes that there is nothing to edit
	 * (as a new one is being created) and opens the modal
	 */
	function createPaymentMethod() {
		selectedMethodToEdit.current = false;
		openFormModal();
	}

	/**
	 * When called, establishes that there is a payment method edit
	 * keeps it's reference and opens the modal so it can access
	 * the info of the about-to-edit method
	 */
	function editPaymentMethod(paymentMethod: PaymentMethod) {
		selectedMethodToEdit.current = paymentMethod;
		openFormModal();
	}

	/**
	 * Calls the server to delete the given payment method
	 *
	 * @param paymentMethod data from the method that will be deleted
	 */
	async function deletePaymentMethod(deletedMethod: PaymentMethod) {
		const { name } = deletedMethod;

		const isDelete = window.confirm(
			`¿Estás seguro que quieres eliminar a: ${name}`
		);

		if (isDelete) {
			try {
				await instance.delete(`/payment_methods/${deletedMethod.id}`);
				enqueueSnackbar("Metodo de pago eliminado con exito", {
					variant: "success",
				});
				setPaymentMethods((paymentMethods) =>
					paymentMethods.filter((method) => method.id !== deletedMethod.id)
				);
				handleDownloadFile(false);
			}
			catch {
				enqueueSnackbar("No se pudo eliminar", { variant: "error" });
			}
		}
	}

	/**
	 * Retrieves specific payment methods from the DB, depending on the
	 * filter and search of the user
	 *
	 * @param filter what field will be used to filter
	 * @param search what the user is searching
	 * @param order either ASC or DESC
	 */
	async function onSubmitSearch(
		filter: string,
		search: string,
		order: QueryOrder
	) {
		try {
			let paymentMethods: PaymentMethod[];

			switch (filter) {
			case "ID":
				paymentMethods = (
					await instance.get<PaymentMethod[]>("/payment_methods/searchByID", {
						params: { order, search },
					})
				).data;
				break;

			case "Titular":
				paymentMethods = (
					await instance.get<PaymentMethod[]>(
						"/payment_methods/searchByOwner",
						{ params: { order, search } }
					)
				).data;
				break;

			case "CLABE":
				paymentMethods = (
					await instance.get<PaymentMethod[]>(
						"/payment_methods/searchByCLABE",
						{ params: { order, search } }
					)
				).data;
				break;

			case "No. Tarjeta":
				paymentMethods = (
					await instance.get<PaymentMethod[]>(
						"/payment_methods/searchByCardNumber",
						{ params: { order, search } }
					)
				).data;
				break;

			case "Banco":
				paymentMethods = (
					await instance.get<PaymentMethod[]>(
						"/payment_methods/searchByBank",
						{ params: { order, search } }
					)
				).data;
				break;

			default:
				paymentMethods = (
					await instance.get<PaymentMethod[]>("/payment_methods", {
						params: { order },
					})
				).data;
			}

			setPaymentMethods(paymentMethods);
		}
		catch {
			enqueueSnackbar("Hubo un error al mostrar los metodos de pago", {
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

						<h1>Métodos de pago</h1>

						{showFormModal && (
							<Modal
								open={showFormModal}
								handleOpen={setShowModal}
								title={
									selectedMethodToEdit.current instanceof Object
										? "Editar un metodo de pago"
										: "Añadir un metodo de pago"
								}
							>
								<PaymentMethodForm
									onSubmit={onPaymentMethodSubmitted}
									paymentMethodData={
										selectedMethodToEdit.current instanceof Object
											? selectedMethodToEdit.current
											: undefined
									}
									handleDownloadFile={handleDownloadFile}
								></PaymentMethodForm>
							</Modal>
						)}

						<TableContainer
							sx={{ width: "900px", maxHeight: "400px" }}
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
									{!(paymentMethods?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										paymentMethods?.map((paymentMethod) => (
											<TableRow key={paymentMethod.id}>
												<TableCell align="left">{paymentMethod.id}</TableCell>
												<TableCell align="left">{paymentMethod.name}</TableCell>
												<TableCell align="left">
													{paymentMethod.CLABE}
												</TableCell>
												<TableCell align="left">
													{paymentMethod.no_card}
												</TableCell>
												<TableCell align="left">{paymentMethod.bank}</TableCell>
												<TableCell align="left">
													{paymentMethod.subsidary}
												</TableCell>
												{isAdmin && (
													<TableCell align="center">
														<IconButton
															onClick={() => editPaymentMethod(paymentMethod)}
														>
															<Edit fontSize="inherit" />
														</IconButton>
														<IconButton
															onClick={() => deletePaymentMethod(paymentMethod)}
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
									onClick={() => createPaymentMethod()}
								>
									<AddCircle fontSize="inherit" />
								</IconButton>

								<ExcelDownloadButton
									apiObjective="payment_methods"
									onDownload={() => setHasDownloadedFile(true)}
								/>

								<FileUpload
									apiObjective="payment_methods"
									onUpload={fetchPaymentMethods}
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

export default LugaresEntrega;
