import React from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Switch,
	TextField,
} from "@mui/material";
import { Catalog } from "models/Catalog";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";

interface CatalogsFormProps {
	onSubmit: (op: boolean) => void;
	CatalogData?: Catalog;
}

const CatalogsForm: React.FC<CatalogsFormProps> = ({
	onSubmit,
	CatalogData,
}) => {
	const { enqueueSnackbar } = useSnackbar();

	async function createCatalog(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const description = data.get("description")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;
		console.log("name: ", name);
		console.log("state: ", state);

		try {
			await instance.post("/catalogs", {
				id: Date.now().toString(),
				name,
				state,
				description,
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Catalog creation
		}
		catch (error: any) {
			enqueueSnackbar("Error al crear el catalogo", { variant: "error" });
			console.log(error);
		}
	}

	async function updateCatalog(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const description = data.get("description")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `/catalogs/${CatalogData?.id}`;

		try {
			console.log(`update endpoint: ${endpoint}`);

			await instance.put(endpoint, {
				name,
				state,
				description,
			});
			onSubmit(true);
		}
		catch (error: any) {
			enqueueSnackbar(`Error al actualizar ${name}`, { variant: "error" });
			alert(
				`Descripcion del error: ${error.message}\nEstado: ${
					error?.status ?? 500
				}`
			);
		}
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
			onSubmit={CatalogData ? updateCatalog : createCatalog}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Nombre"
				name="name"
				variant="outlined"
				defaultValue={CatalogData?.name}
				type="text"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				name="description"
				label="Descripcion"
				placeholder="Placeholder"
				multiline
				variant="outlined"
				color="primary"
				required
			/>
			<FormGroup>
				<FormControlLabel
					control={<Switch name="state" defaultChecked={CatalogData?.state} />}
					label="Estado"
				/>
			</FormGroup>

			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default CatalogsForm;
