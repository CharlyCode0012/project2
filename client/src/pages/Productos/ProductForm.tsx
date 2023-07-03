import React, { ReactNode, useState, useRef, useEffect } from "react";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { Product } from "models/Product";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";
import { Category } from "models/Category";

const regexKeyWord = /^[A-Za-z0-9\s\u00f1\u00d1]+$/g;

interface ProductsFormProps {
	onSubmit: (op: boolean) => void;
	ProductData?: Product;
	catalogId: React.MutableRefObject<string>;
	handleDownloadFile: (hasDownloadedFile: boolean) => void;
}

const ProductsForm: React.FC<ProductsFormProps> = ({
	onSubmit,
	ProductData,
	catalogId,
	handleDownloadFile,
}) => {
	const { enqueueSnackbar } = useSnackbar();
	const [categories, setCategories] = useState<Category[]>([]);
	const categoryId = useRef<string>(ProductData?.id_category ?? "");

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

		if (!regexKeyWord.test(key_word ?? "")) {
			return window.alert(
				"Recuerda que la palabra clave no acepta valores que no sean alfanumericos"
			);
		}

		try {
			await instance.post(
				"/products",
				{
					id: Date.now().toString(),
					product_name,
					description,
					key_word,
					price,
					stock,
				},
				{
					params: {
						catalogId: catalogId.current,
						categoryId: categoryId.current,
					},
				}
			);
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Product creation
			handleDownloadFile(false);
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
		const product_name = data.get("name")?.toString()?.trim();
		const description = data.get("description")?.toString()?.trim();
		const key_word = data.get("keyWord")?.toString()?.trim();
		const price = data.get("price")?.toString().trim();
		const stock = data.get("stock")?.toString().trim();

		if (!regexKeyWord.test(key_word ?? "")) {
			return window.alert(
				"Recuerda que la palabra clave no acepta valores que no sean alfanumericos"
			);
		}

		const productEdit = {
			product_name,
			description,
			key_word,
			price,
			stock,
			categoryId: categoryId.current,
			catalogId: catalogId.current,
		};

		console.log(productEdit);

		const endpoint = `/products/${ProductData?.id}`;

		try {
			await instance.put(
				endpoint,
				{
					product_name,
					description,
					key_word,
					price,
					stock,
				},
				{
					params: {
						categoryId: categoryId.current,
					},
				}
			);
			onSubmit(true);
			handleDownloadFile(false);
		}
		catch (error: any) {
			enqueueSnackbar(`Error al actualizar ${product_name}`, {
				variant: "error",
			});
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
				label="Descripción"
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

export default ProductsForm;
