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
	TableSortLabel
} from "@mui/material";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import { DisplayedDeliveryPlace, PlacesDelivery } from "models/PlacesDelivery";
import Modal from "@/Modal/Modal";
import DeliveryPlaceForm from "./LugaresEntregaForm";
import { useSnackbar } from "notistack";
import { instance } from "helper/API";
import { QueryOrder, SearchAppBar } from "@/Navbar/SearchAppBar";

const LugaresEntrega = () => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Headers that will be displayed to the table
	 */
	const tableHeaders = ["ID", "Municipio", "Calle", "Colonia", "No. Casa", "CP", "Horario"];

	/**
	 * Options that the user can select to filter the data
	 * that is displayed in the table
	 */
	const searchOptions = ["ID", "Municipio", "Calle", "Colonia", "CP"];

	/**
	 * Saves the delivery places stored in the DB
	 * and displays them in the table
	 */
	const [deliveryPlaces, setDeliveryPlaces] = useState<DisplayedDeliveryPlace[]>([]);

	/**
	 * Determines if the place's modal will be shown
	 * (only when user creates or edits a place)
	 */
	const [showFormModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);

	/**
	 * Keeps track of the place that the user wanted to
	 * edit (stays null when user creates a new place)
	 */
	const selectedPlaceToEdit = useRef<DisplayedDeliveryPlace | boolean>(false);

	/**
	 * When rendered, places are obtained from DB and displayed in the table
	 */
	useEffect(() => {
		fetchDeliveryPlaces();
	}, []);

	/**
	 * Takes the places returned by the server and converts them
	 * into a new structure that is used to display their data to 
	 * the table
	 *  
	 * @param places given by the DB 
	 */
	function formatFetchedPlacesForDisplay (places: PlacesDelivery[]) {
		return places.map((place) => {
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
		});
	}

	/**
	 * Fetches the places from the DB
	 * Shows a notification to user when something went wrong
	 */
	async function fetchDeliveryPlaces () {
		try {
			const { data: places } = await instance.get<PlacesDelivery[]>("/places");
			setDeliveryPlaces(formatFetchedPlacesForDisplay(places));
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
		fetchDeliveryPlaces();
	}

	/**
	 * When called, establishes that there is nothing to edit 
	 * (as a new one is being created) and opens the modal 
	 */
	function createDeliveryPlace () {
		selectedPlaceToEdit.current = false;
		openFormModal();
	}

	/**
	 * When called, establishes that there is a place edit 
	 * keeps it's reference and opens the modal so it can access
	 * the info of the about-to-edit place 
	 */
	function editDeliveryPlace (place: DisplayedDeliveryPlace) {
		selectedPlaceToEdit.current = place;
		openFormModal();
	}

	/**
	 * Calls the server to delete the given place
	 * 
	 * @param place data from the place that will be deleted
	 */
	async function deleteDeliveryPlace (deletedPlace: DisplayedDeliveryPlace) {
		try {
			await instance.delete(`/places/${deletedPlace.id}`);
			enqueueSnackbar("Lugar eliminado con exito", { variant: "success" });
			setDeliveryPlaces((deliveryPlaces) => deliveryPlaces.filter((place) => place.id !== deletedPlace.id));
		}

		catch {
			enqueueSnackbar("No se pudo eliminar", { variant: "error" });
		}
	}

	async function onSubmitSearch(filter: string, search: string, order: QueryOrder) {
		try {
			let places: PlacesDelivery[];

			switch (search) {
			// TODO: Implement cases
			default: places = await fetchPlacesWithOrder(order);
			}
			fetchPlacesWithOrder(order as QueryOrder);
		}

		catch {
			enqueueSnackbar("Hubo un error al mostrar los lugares", { variant: "error" });
		}
	}

	async function fetchPlacesWithOrder (order: QueryOrder) {
		const { data: orderedPlaces } = await instance.get<PlacesDelivery[]>("/places", {
			params: { order }
		});

		return orderedPlaces;
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
						<SearchAppBar searchOptions={searchOptions} onSubmitSearch={onSubmitSearch} />
						
						<h1>Lugares de Entrega</h1>
						
						{showFormModal && (
							<Modal
								open={showFormModal}
								handleOpen={setShowModal}
								title={(selectedPlaceToEdit.current instanceof Object) ? "Editar un lugar" : "Crear un lugar"}
							>
								<DeliveryPlaceForm
									onSubmit={onPlaceSubmitted}
									placeData={(selectedPlaceToEdit.current instanceof Object) ? selectedPlaceToEdit.current : undefined}
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
							onClick={() => createDeliveryPlace()}
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
