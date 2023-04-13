import React from "react";
import {
	Box,
	Button,
	TextField,
} from "@mui/material";
import { DisplayedDeliveryPlace, PlacesDelivery } from "models/PlacesDelivery";
import { instance } from "helper/API";

interface DeliveryPlaceFormProps {
	placeData?: DisplayedDeliveryPlace;
	onSubmit: (wasAnUpdate: boolean) => void;
}

const DeliveryPlaceForm: React.FC<DeliveryPlaceFormProps> = ({
	placeData,
	onSubmit,
}) => {

	/**
	 * Takes what was filled in the form and saves a new
	 * delivery place in the DB
	 * @param event 
	 */
	async function createPlaceData (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get place data from the form
		const data = new FormData(event.currentTarget);
		const township = data.get("municipio")?.toString();
		const street = data.get("calle")?.toString();
		const colony = data.get("colonia")?.toString();
		const homeNumber = data.get("no-casa")?.toString();
		const cp = data.get("cp")?.toString();
		const openingTime = data.get("hora-abierto")?.toString();
		const closingTime = data.get("hora-cerrado")?.toString();

		// Upload data to DB
		try {
			await instance.post("/places", {
				id: Date.now(),
				name: township,
				address: `${colony}. ${street}. ${homeNumber}`,
				cp: cp,
				open_h: openingTime,
				close_h: closingTime,
			} as PlacesDelivery);

			onSubmit(false); // "false" tells the submission wasn't an update, it was a new place creation
		}

		catch (error) {
			// TODO: Show user what happened
			console.log(error);
		}
	}

	function updatePlaceData () {
		// TODO: Fill body
	}

	return (
		<Box
			component="form"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "1rem",
				padding: 2,
			}}
			onSubmit={placeData ? updatePlaceData : createPlaceData}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Municipio"
				name="municipio"
				variant="outlined"
				value={placeData?.township}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Calle"
				name="calle"
				variant="outlined"
				value={placeData?.street}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Colonia"
				name="colonia"
				variant="outlined"
				value={placeData?.colony}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="No. Casa"
				name="no-casa"
				variant="outlined"
				value={placeData?.homeNumber}
				type="number"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="C. P."
				name="cp"
				variant="outlined"
				value={placeData?.cp}
				type="number"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Hora de apertura"
				name="hora-abierto"
				variant="outlined"
				value={placeData?.schedule.split(" a ")[0]}
				type="time"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Hora de cierre"
				name="hora-cerrado"
				variant="outlined"
				value={placeData?.schedule.split(" a ")[1]}
				type="time"
				required
			/>

			<Button type="submit" variant="contained" fullWidth>
				{ placeData ? "Actualizar" : "Crear" }
			</Button>
		</Box>
	);
};

export default DeliveryPlaceForm;
