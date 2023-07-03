import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { MenuData } from "models/Menu";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";

interface MenuFormProps {
	MenuData?: MenuData;
	onSubmit: (wasAnUpdate: boolean) => void;
	handleDownloadFile: (hasDownloadedFile: boolean) => void;
}

const MenuForm: React.FC<MenuFormProps> = ({
	onSubmit,
	MenuData,
	handleDownloadFile,
}) => {
	const { enqueueSnackbar } = useSnackbar();

	async function createMenu(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const answer = data.get("answer")?.toString();

		try {
			await instance.post("/menus", {
				id: Date.now().toString(),
				name,
				answer,
				principalMenu: 0,
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new MenuOption creation
			handleDownloadFile(false);
		}
		catch {
			enqueueSnackbar("Error al crear el menu", { variant: "error" });
		}
	}

	async function updateMenu(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString()?.trim();
		const answer = data.get("answer")?.toString()?.trim();

		const endpoint = `/menus/${MenuData?.id}`;

		try {
			await instance.put(endpoint, {
				name,
				answer,
			});
			onSubmit(true);
			handleDownloadFile(false);
		}
		catch {
			enqueueSnackbar(`Error al actualizar ${name}`, {
				variant: "error",
			});
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
			onSubmit={MenuData ? updateMenu : createMenu}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Título"
				name="name"
				variant="outlined"
				defaultValue={MenuData?.name}
				type="text"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				name="answer"
				label="Texto"
				placeholder="Placeholder"
				multiline
				variant="outlined"
				defaultValue={MenuData?.answer}
				color="primary"
				required
			/>
			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default MenuForm;
