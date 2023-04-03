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

const initialForm: Category = {
	id: 0,
	name: "",
	state: false,
};

interface CategoriesFormProps {
	text?: string;
	handleOpen: (op: boolean) => void;
	dataToEdit?: Category;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
	handleOpen,
	dataToEdit,
}) => {
	const { form, handleChange } = useForm<Category>(initialForm, dataToEdit);

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
