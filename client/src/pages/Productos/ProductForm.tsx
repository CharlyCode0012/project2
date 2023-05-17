import React, { ReactNode, useState, useRef, useEffect } from "react";
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormGroup,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
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
	const categoryId = useRef<string>("");

	useEffect(() => {
		fetchCategories();
	}, []);

	async function fetchCategories() {
		try {
			const { data: Categories } = await instance.get<Category[]>(
				"/categories"
			);
			setCategories(Categories);
		}
		catch {
			enqueueSnackbar("Hubo un error al traer las categorias", {
				variant: "error",
			});
		}
	}

	async function createProduct(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const product_name = data.get("name")?.toString();
		const description = data.get("description")?.toString();
		const key_word = data.get("keyWord")?.toString();
		const price = data.get("price")?.toString();
		const stock = data.get("stock")?.toString();

		try {
			await instance.post("/products", {
				id: Date.now().toString(),
				product_name,
				description,
				key_word,
				price,
				stock,
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
		const key_word = data.get("keyWord")?.toString();
		const price = data.get("price")?.toString();
		const stock = data.get("stock")?.toString();

		const endpoint = `/products/${ProductData?.id}`;

		try {
			console.log(`update endpoint: ${endpoint}`);

			await instance.put(endpoint, {
				name,
				key_word,
				price,
				stock,
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

	function handleCategoryChange(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		categoryId.current = event.target.value as string;
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
				defaultValue={ProductData?.product_name}
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
				defaultValue={ProductData?.description}
				color="primary"
				required
			/>
			<FormControl>
				<InputLabel>Categoría</InputLabel>
				<Select
					label="Categoría"
					sx={{ width: "300px", color: "inherit" }}
					onChange={handleCategoryChange}
					defaultValue={ProductData?.id_category}
				>
					{categories?.length > 0 ? (
						categories?.map((category: Category) => (
							<MenuItem key={category.id} value={category.id}>
								{category.category_name}
							</MenuItem>
						))
					) : (
						<MenuItem value=""> Sin categorias</MenuItem>
					)}
				</Select>
			</FormControl>
			<TextField
				sx={{ width: "300px" }}
				name="keyWord"
				label="Palabra Clave"
				placeholder="Placeholder"
				multiline
				variant="outlined"
				defaultValue={ProductData?.key_word}
				color="primary"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				name="price"
				label="Precio"
				placeholder="Placeholder"
				multiline
				variant="outlined"
				defaultValue={ProductData?.price}
				color="primary"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				name="stock"
				label="Cantidad"
				placeholder="Placeholder"
				multiline
				variant="outlined"
				defaultValue={ProductData?.stock}
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
