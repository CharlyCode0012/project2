import React from "react";
import {
	Box,
	Button,
	TextField,
} from "@mui/material";
import { PlacesDelivery } from "models/PlacesDelivery";
import { instance } from "helper/API";

// TODO: Determine if it is needed
// const initialForm: PlacesDelivery = {
// 	id: 0,
// 	name: "",
// 	state: false,
// };

interface DeliveryPlaceFormProps {
	url: string;
	places: PlacesDelivery[];
	text?: string;
	placeData?: PlacesDelivery;

	handleOpen: (op: boolean) => void;
	setPlaces: (data: PlacesDelivery[]) => void;
}

const DeliveryPlaceForm: React.FC<DeliveryPlaceFormProps> = ({
	handleOpen,
	placeData,
	url,
	places,
	setPlaces,
}) => {
	
	// TODO: Determine if it is needed
	// const { form, handleChange, handleChecked } = useForm<Category>(
	// 	initialForm,
	// 	dataToEdit
	// );

	// TODO: Adjust CRUD functions
	// async function createCategory() {
	// 	try {
	// 		if (form.id === 0) form.id = Date.now();
	// 		const response = await instance.post(url, form);
	// 		const createdCategory = await response.data;
	// 		if (Array.isArray(categories)) setCategories([...categories, form]);
	// 		else setCategories([form]);

	// 		console.log(createdCategory);
	// 	}
	// 	catch (error) {
	// 		console.log(error);
	// 	}
	// }

	// async function updateCategory() {
	// 	const data = form;
	// 	const endpoint = `${url}/${data.id}`;
	// 	try {
	// 		console.log(`update endpoint: ${endpoint}`);

	// 		const res = await instance.put(endpoint, data);
	// 		const dataCategory = await res.data;
	// 		console.log(dataCategory);
	// 		if (!dataCategory.err) {
	// 			/* setDb([...db, res]); */
	// 			const newData = categories.map((el) => (el.id === data.id ? data : el));
	// 			setCategories(newData);
	// 		}
	// 		else {
	// 			const message = dataCategory?.statusText;
	// 			const status = dataCategory?.status;
	// 			throw { message, status };
	// 		}
	// 	}
	// 	catch (error: any) {
	// 		alert(
	// 			`Descripcion del error: ${error.message}\nEstado: ${
	// 				error?.status ?? 500
	// 			}`
	// 		);
	// 	}
	// }

	// function handleSubmit() {
	// 	if (!dataToEdit) createCategory();
	// 	else updateCategory();
	// 	handleOpen(false);
	// }

	function createPlaceData (event: React.FormEvent<HTMLFormElement>) {
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

		// TODO: Remove
		console.table({ township, street, colony, homeNumber, cp, openingTime, closingTime });
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
				value={placeData?.name}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Calle"
				name="calle"
				variant="outlined"
				value={placeData?.name}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Colonia"
				name="colonia"
				variant="outlined"
				value={placeData?.name}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="No. Casa"
				name="no-casa"
				variant="outlined"
				value={placeData?.name}
				type="number"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="C. P."
				name="cp"
				variant="outlined"
				value={placeData?.name}
				type="number"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Hora de apertura"
				name="hora-abierto"
				variant="outlined"
				value={placeData?.name}
				type="time"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Hora de cierre"
				name="hora-cerrado"
				variant="outlined"
				value={placeData?.name}
				type="time"
				required
			/>

			<Button type="submit" variant="contained" fullWidth>
				{ placeData ? "Crear" : "Actualizar" }
			</Button>
		</Box>
	);
};

export default DeliveryPlaceForm;
