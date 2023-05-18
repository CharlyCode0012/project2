import React from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Switch,
	TextField,
} from "@mui/material";
import { Question } from "models/Question";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";

interface DudasFormProps {
	onSubmit: (op: boolean) => void;
	questionData?: Question;
}

const DudasForm: React.FC<DudasFormProps> = ({ onSubmit, questionData }) => {
	const { enqueueSnackbar } = useSnackbar();

	async function updateCategory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `/categories/${questionData?.id}`;

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
			onSubmit={updateCategory}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Responder"
				name="answer"
				variant="outlined"
				type="text"
				required
			/>
			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default DudasForm;
