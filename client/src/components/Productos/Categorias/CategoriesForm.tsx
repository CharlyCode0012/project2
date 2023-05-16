import React from "react";
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
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;
		console.log("name: ", name);
		console.log("state: ", state);

		try {
			await instance.post("/categories", {
				id: Date.now().toString(),
				name,
				state,
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
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `/categories/${categoryData?.id}`;

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
			onSubmit={categoryData ? updateCategory : createCategory}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Nombre"
				name="name"
				variant="outlined"
				defaultValue={categoryData?.category_name}
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
