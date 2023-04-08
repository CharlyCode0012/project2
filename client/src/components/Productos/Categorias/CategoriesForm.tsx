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
import { useForm } from "hooks/useForm";
import { instance } from "helper/API";
import { createDecipheriv } from "crypto";

const initialForm: Category = {
	id: 0,
	name: "",
	state: false,
};

interface CategoriesFormProps {
	text?: string;
	handleOpen: (op: boolean) => void;
	dataToEdit?: Category;
	endpoint: string;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
	handleOpen,
	dataToEdit,
	endpoint,
}) => {
	const { form, handleChange } = useForm<Category>(initialForm, dataToEdit);

	async function createCategory() {
		try {
			const response = await instance.post(endpoint, form);
			const createdCategory = await response.data;
			console.log(createdCategory);
		}
		catch (error) {
			console.log(error);
		}
	}

	function handleSubmit() {
		handleOpen(false);
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
			onSubmit={handleSubmit}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Nombre"
				name="name"
				variant="outlined"
				value={form.name}
				type="text"
				onChange={handleChange}
				required
			/>
			<FormGroup>
				<FormControlLabel
					control={<Switch onChange={handleChange} value={form.state} />}
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
