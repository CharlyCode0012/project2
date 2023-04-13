import React, { useState } from "react";
import Navbar from "@/Navbar/Navbar";
import { Box, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
// import { SearchAppBar } from "@/Navbar/SearchAppBar";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import { PlacesDelivery } from "models/PlacesDelivery";
import Modal from "@/Modal/Modal";
import DeliveryPlaceForm from "./LugaresEntregaForm";

const LugaresEntrega = () => {
	/**
	 * Headers that will be displayed to the table
	 */
	const tableHeaders = ["ID", "Municipio", "Calle", "Colonia", "No. Casa", "CP", "Horario"];

	const rawDeliveryPlaces: PlacesDelivery[] = [];
	const [deliveryPlaces, setDeliveryPlaces] = useState<PlacesDelivery[]>(rawDeliveryPlaces);

	const [showFormModal, setShowModal] = useState(false);
	const openFormModal = () => setShowModal(true);
	const closeFormModal = () => setShowModal(false);


	function onPlaceSubmited () {
		closeFormModal();
		// TODO: Show notification
		// TODO: Refresh table data
	}

	function editDeliveryPlace (place: PlacesDelivery) {
		// TODO: Fill body
	}

	function deleteDeliveryPlace (place: PlacesDelivery) {
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
									onSubmit={closeFormModal}
								></DeliveryPlaceForm>
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
									{!(deliveryPlaces?.length > 0) ? (
										<TableRow>
											<TableCell>Sin datos</TableCell>
										</TableRow>
									) : (
										deliveryPlaces?.map((place) => (
											<TableRow key={place.id}>
												<TableCell align="left">{place.id}</TableCell>
												<TableCell align="left">{place.name}</TableCell>
												<TableCell align="left">{place.address}</TableCell>
												<TableCell align="left">{place.cp}</TableCell>
												<TableCell align="left">{place.open_h}</TableCell>
												<TableCell align="left">{place.close_h}</TableCell>

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
