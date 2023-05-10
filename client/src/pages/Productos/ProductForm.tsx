import React, { useState } from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Switch,
	TextField,
} from "@mui/material";
import { Product } from "models/Product";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import { Category } from "models/Category";

interface ProductsFormProps {
	onSubmit: (op: boolean) => void;
	ProductData?: Product;
}

const CatalogsForm: React.FC<ProductsFormProps> = ({
	onSubmit,
	ProductData,
}) => {
	const { enqueueSnackbar } = useSnackbar();
	const [categories, setCategories] = useState<Category[]>([]);

	async function createProduct(event: React.FormEvent<HTMLFormElement>) {
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
			await instance.post("/products", {
				id: Date.now().toString(),
				name,
				state,
				description,
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Product creation
		}
		catch (error: any) {
			enqueueSnackbar("Error al crear el producto", { variant: "error" });
			console.log(error);
		}
	}

	async function updateProduct(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const description = data.get("description")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `/products/${ProductData?.id}`;

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
			onSubmit={ProductData ? updateProduct : createProduct}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Nombre"
				name="name"
				variant="outlined"
				defaultValue={ProductData?.name}
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

			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default CatalogsForm;
