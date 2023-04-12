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
	handleOpen: (op: boolean) => void;
	url: string;
	categories: Category[];
	setCategories: (data: Category[]) => void;
	text?: string;
	dataToEdit?: Category;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
	handleOpen,
	dataToEdit,
	url,
	categories,
	setCategories,
}) => {
	const { form, handleChange, handleChecked } = useForm<Category>(
		initialForm,
		dataToEdit
	);

	async function createCategory() {
		try {
			if (form.id === 0) form.id = Date.now();
			const response = await instance.post(url, form);
			const createdCategory = await response.data;
			if (Array.isArray(categories)) setCategories([...categories, form]);
			else setCategories([form]);

			console.log(createdCategory);
		}
		catch (error) {
			console.log(error);
		}
	}

	async function updateCategory() {
		const data = form;
		const endpoint = `${url}/${data.id}`;
		try {
			console.log(`update endpoint: ${endpoint}`);

			const res = await instance.put(endpoint, data);
			const dataCategory = await res.data;
			console.log(dataCategory);
			if (!dataCategory.err) {
				/* setDb([...db, res]); */
				const newData = categories.map((el) => (el.id === data.id ? data : el));
				setCategories(newData);
			}
			else {
				const message = dataCategory?.statusText;
				const status = dataCategory?.status;
				throw { message, status };
			}
		}
		catch (error: any) {
			alert(
				`Descripcion del error: ${error.message}\nEstado: ${
					error?.status ?? 500
				}`
			);
		}
	}

	function handleSubmit() {
		if (!dataToEdit) createCategory();
		else updateCategory();
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
					control={
						<Switch
							name="state"
							onChange={handleChecked}
							checked={form.state}
						/>
					}
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
