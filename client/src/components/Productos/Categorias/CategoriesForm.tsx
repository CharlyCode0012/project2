import React, { useState } from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Switch,
	TextField,
} from "@mui/material";
import { Category } from "models/Category";
import { instance } from "helper/API";
import { createDecipheriv } from "crypto";
import { useSnackbar } from "notistack";

interface CategoriesFormProps {
	onSubmit: (op: boolean) => void;
	categoryData?: Category;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
	onSubmit,
	categoryData,
}) => {
	const { enqueueSnackbar } = useSnackbar();

	async function createCategory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const state = data.get("state");
		console.log("name: ", name);
		console.log("state: ", state);

		try {
			await instance.post("/categories", {
				name,
				state,
			});
			enqueueSnackbar(`Se creo exitosamente ${name}`, {
				variant: "success",
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Category creation
		}
		catch (error: any) {
			enqueueSnackbar("Error al crear la categoría", { variant: "error" });
			console.log(error);
		}
	}

	async function updateCategory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const state = data.get("state");

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `categories/${categoryData?.id}`;

		try {
			console.log(`update endpoint: ${endpoint}`);

			await instance.put(endpoint, {
				name,
				state,
			});
			enqueueSnackbar(`Se actualizo exitosamente ${name}`, {
				variant: "success",
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
			onSubmit={categoryData ? updateCategory : createCategory}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Nombre"
				name="name"
				variant="outlined"
				defaultValue={categoryData?.name}
				type="text"
				required
			/>
			<FormGroup>
				<FormControlLabel
					control={<Switch name="state" defaultChecked={categoryData?.state} />}
					label="Estado"
				/>
			</FormGroup>
			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default CategoriesForm;
