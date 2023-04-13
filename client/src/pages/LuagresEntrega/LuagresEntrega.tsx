import React, { useEffect, useState } from "react";
import Navbar from "@/Navbar/Navbar";
import { Box, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import { DisplayedDeliveryPlace, PlacesDelivery } from "models/PlacesDelivery";
import Modal from "@/Modal/Modal";
import DeliveryPlaceForm from "./LugaresEntregaForm";
import { useSnackbar } from "notistack";
import { instance } from "helper/API";

const LugaresEntrega = () => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Headers that will be displayed to the table
	 */
	const tableHeaders = ["ID", "Municipio", "Calle", "Colonia", "No. Casa", "CP", "Horario"];

	const rawDeliveryPlaces: DisplayedDeliveryPlace[] = []; // TODO: Remove when they can be retrieved from DB

	/**
	 * Saves the delivery places stored in the DB
	 * and displays them in the table
	 */
	const [deliveryPlaces, setDeliveryPlaces] = useState<DisplayedDeliveryPlace[]>(rawDeliveryPlaces);

	/**
	 * Determines if the place's modal will be shown
	 * (only when user creates or edits a place)
	 */
	const [showFormModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Al cargar, obtiene los lugares de la DB y los muestra en la tabla
	 */
	useEffect(() => {
		fetchDeliveryPlaces();
	}, []);

	async function fetchDeliveryPlaces () {
		try {
			const { data } = await instance.get<PlacesDelivery[]>("/places");
			setDeliveryPlaces(data.map((place) => {
				const [colony, street, homeNumber] = place.address.split(". ");

				return {
					id: place.id,
					township: place.name,
					street,
					colony,
					homeNumber,
					cp: place.cp,
					schedule: `${place.open_h} a ${place.close_h}`
				} as DisplayedDeliveryPlace;
			}));
		}

		catch {
			enqueueSnackbar("Hubo un error al mostrar los lugares", { variant: "error" });
		}
	}

	/**
	 * Gets called when a place was created or edited, closes the modal,
	 * notifies the user and refreshes the table
	 * 
	 * @param wasAnUpdate changes the notification message depending on the action (created / edited) 
	 */
	function onPlaceSubmitted (wasAnUpdate: boolean) {
		closeFormModal();
		enqueueSnackbar(wasAnUpdate ? "Se actualizó con éxito" : "Se creo con éxito", { variant: "success" });
		// TODO: Refresh table data
	}

	function editDeliveryPlace (place: DisplayedDeliveryPlace) {
		// TODO: Fill body
	}

	function deleteDeliveryPlace (place: DisplayedDeliveryPlace) {
		// TODO: Fill body
	}

	return (
		<>
			<Navbar />

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
						{/* TODO: Determine if this is important */}
						{/* <SearchAppBar onSubmitSearch={onSubmitSearch} /> */}
						
						<h1>Lugares de Entrega</h1>
						
						{showFormModal && (
							<Modal
								open={showFormModal}
								handleOpen={setShowModal}
								title="Lugares de entrega" // TODO: Change name depending on create or update
							>
								<DeliveryPlaceForm
									onSubmit={onPlaceSubmitted}
								></DeliveryPlaceForm>
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
									{!(deliveryPlaces?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										deliveryPlaces?.map((place) => (
											<TableRow key={place.id}>
												<TableCell align="left">{place.id}</TableCell>
												<TableCell align="left">{place.township}</TableCell>
												<TableCell align="left">{place.street}</TableCell>
												<TableCell align="left">{place.colony}</TableCell>
												<TableCell align="left">{place.homeNumber}</TableCell>
												<TableCell align="left">{place.cp}</TableCell>
												<TableCell align="left">{place.schedule}</TableCell>

												<TableCell align="center">
													<IconButton onClick={() => editDeliveryPlace(place)}>
														<Edit fontSize="inherit" />
													</IconButton>
													<IconButton
														onClick={() => deleteDeliveryPlace(place)}
													>
														<DeleteForever fontSize="inherit" />
													</IconButton>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
						<IconButton
							sx={{ alignSelf: "flex-start", fontSize: "40px", padding: "0px" }}
							onClick={() => openFormModal()}
						>
							<AddCircle fontSize="inherit" />
						</IconButton>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default LugaresEntrega;
