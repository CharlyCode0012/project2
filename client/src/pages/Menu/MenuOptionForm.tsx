import React, { ReactNode, useState, useEffect } from "react";
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
import { MenuData, MenuOption } from "models/Menu";
import { Catalog } from "models/Catalog";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";

const regexKeyWord = /^[A-Za-z0-9\s\u00f1\u00d1]+$/g;

interface MenuOptionFormProps {
	onSubmit: (op: boolean) => void;
	OptionData?: MenuOption;
	menuID: string | undefined;
	handleDownloadFile: (hasDownloadedFile: boolean) => void;
}

const MenuOptionForm: React.FC<MenuOptionFormProps> = ({
	onSubmit,
	OptionData,
	menuID,
	handleDownloadFile,
}) => {
	const { enqueueSnackbar } = useSnackbar();
	const [references, setReferences] = useState<Catalog[] | MenuData[]>([]);
	const [actionType, setActionType] = useState<string>(
		OptionData?.action_type ?? ""
	);

	async function fetchMenu() {
		try {
			const { data: Menus } = await instance.get<MenuData[]>("/menus");
			setReferences(Menus);
		}
		catch {
			enqueueSnackbar("Hubo un error al traer los menus", {
				variant: "error",
			});
		}
	}

	async function fetchCatalogs() {
		try {
			const { data: Catalogs } = await instance.get<Catalog[]>("/catalogs");
			setReferences(Catalogs);
		}
		catch {
			enqueueSnackbar("Hubo un error al traer los catálogos", {
				variant: "error",
			});
		}
	}

	async function fetchReference() {
		switch (actionType) {
		case "Submenu":
			await fetchMenu();
			break;
		case "catalog":
			await fetchCatalogs();
			break;
		default:
			break;
		}
	}

	useEffect(() => {
		fetchReference();
	}, [actionType]);

	function handleChangeActionType(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		setActionType(event.target.value as string);
		setReferences([]);
		fetchReference();
	}

	function handleChangeReference(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		switch (actionType) {
		case "Submenu":
			fetchMenu();
			break;
		case "catalog":
			fetchCatalogs();
			break;
		default:
			break;
		}
	}

	async function createProduct(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const option = data.get("option")?.toString();
		const keywords = data.get("keyWord")?.toString();
		const reference = data.get("reference")?.toString();
		const answer = data.get("answer")?.toString().trim();

		try {
			await instance.post(
				"/menu_options",
				{
					id: Date.now().toString(),
					answer,
					option,
					keywords,
					reference,
					action_type: actionType,
				},
				{
					params: {
						menuID,
					},
				}
			);
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new MenuOption creation
			handleDownloadFile(false);
		}
		catch {
			enqueueSnackbar("Error al crear el producto", { variant: "error" });
		}
	}

	async function updateProduct(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const option = data.get("option")?.toString()?.trim();
		const keywords = data.get("keyWord")?.toString()?.trim();
		const reference = data.get("reference")?.toString().trim() ?? null;
		const answer = data.get("answer")?.toString().trim() ?? null;

		if (!regexKeyWord.test(keywords ?? "")) {
			return window.alert(
				"Recuerda que la palabra clave no acepta valores que no sean alfanumericos"
			);
		}

		const endpoint = `/menu_options/${OptionData?.id}`;

		try {
			await instance.put(endpoint, {
				answer,
				option,
				keywords,
				reference,
				action_type: actionType,
			});
			onSubmit(true);
			handleDownloadFile(false);
		}
		catch {
			enqueueSnackbar(`Error al actualizar ${keywords}`, {
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
			onSubmit={OptionData ? updateProduct : createProduct}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Opción"
				name="option"
				variant="outlined"
				defaultValue={OptionData?.option}
				type="text"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				name="keyWord"
				label="Palabra Clave"
				placeholder="Palabra Clave"
				multiline
				variant="outlined"
				defaultValue={OptionData?.keywords}
				color="primary"
				required
			/>
			<FormControl>
				<InputLabel>Action</InputLabel>
				<Select
					label="Acciones"
					sx={{ width: "300px", color: "inherit" }}
					onChange={handleChangeActionType}
					defaultValue={OptionData?.action_type}
				>
					<MenuItem value={"Submenu"}>SubMenu</MenuItem>
					<MenuItem value={"catalog"}>Catálogos</MenuItem>
					<MenuItem value={"link"}>Link</MenuItem>
					<MenuItem value={"message"}>Mensaje</MenuItem>
				</Select>
			</FormControl>
			<TextField
				sx={{ width: "300px" }}
				label="Respuesta"
				name="answer"
				variant="outlined"
				defaultValue={OptionData?.answer}
				type="text"
			/>
			{!(
				actionType === "message" ||
				actionType === "link" ||
				actionType === ""
			) && (
				<FormControl>
					<InputLabel>Referencia</InputLabel>
					<Select
						label="Referencia"
						sx={{ width: "300px", color: "inherit" }}
						onChange={handleChangeReference}
						defaultValue={OptionData?.reference}
						name="reference"
					>
						{references?.length > 0 ? (
							references?.map((reference) => (
								<MenuItem key={reference.id} value={reference.id}>
									{reference.name}
								</MenuItem>
							))
						) : (
							<MenuItem value=""> Sin info </MenuItem>
						)}
					</Select>
				</FormControl>
			)}

			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default MenuOptionForm;
