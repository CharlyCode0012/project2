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
import { Textarea } from "@mui/joy";

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
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;
		console.log("name: ", name);
		console.log("state: ", state);

		try {
			await instance.post("/Catalogs", {
				id: Date.now().toString(),
				name,
				state,
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Catalog creation
		}
		catch (error: any) {
			enqueueSnackbar("Error al crear la categoría", { variant: "error" });
			console.log(error);
		}
	}

	async function updateCatalog(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `/Catalogs/${CatalogData?.id}`;

		try {
			console.log(`update endpoint: ${endpoint}`);

			await instance.put(endpoint, {
				name,
				state,
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
			<FormGroup>
				<FormControlLabel
					control={<Switch name="state" defaultChecked={CatalogData?.state} />}
					label="Estado"
				/>
			</FormGroup>
			<Textarea
				name="description"
				placeholder="Descripcion"
				variant="outlined"
			/>

			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default CatalogsForm;
