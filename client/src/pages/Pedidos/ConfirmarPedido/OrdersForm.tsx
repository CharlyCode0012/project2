import React from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	TextField,
} from "@mui/material";
import { Order } from "models/Order";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";

interface OrdersFormProps {
	onSubmit: (op: boolean) => void;
	OrderData?: Order;
}

const orderSate = ["Pagado", "Abonado", "NA"];

const OrdersForm: React.FC<OrdersFormProps> = ({ onSubmit, OrderData }) => {
	const { enqueueSnackbar } = useSnackbar();

	const isNumeric = (value: string) => {
		const num = 0;
		// Utiliza una expresión regular para verificar si el valor es numérico
		return /^\d*(\.\d{1})?\d{0,1}$/.test(value);
	};

	async function createOrder(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const amount = data.get("amount")?.toString();
		const state = data.get("state")?.toString();

		console.log("state: ", state);

		if (!isNumeric(amount ?? ""))
			return enqueueSnackbar("El precio no es numerico", { variant: "error" });

		try {
			await instance.post("/order", {
				id: Date.now().toString(),
				state,
				amount,
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Order creation
		}
		catch (error: any) {
			enqueueSnackbar("Error al crear el catalogo", { variant: "error" });
			console.log(error);
		}
	}

	async function updateOrder(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const folio = OrderData?.folio;
		const amount = data.get("amount")?.toString();
		const state = data.get("state")?.toString();

		console.log("state: ", state, "folio: ", folio);
		const endpoint = `/order/${OrderData?.id}`;

		if (!isNumeric(amount ?? ""))
			return enqueueSnackbar("El precio no es numerico", { variant: "error" });

		try {
			await instance.put(
				endpoint,
				{
					state,
					amount,
				},
				{ params: { folio } }
			);
			onSubmit(true);
		}
		catch (error: any) {
			enqueueSnackbar("Error al actualizar el pedido", { variant: "error" });
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
			onSubmit={OrderData ? updateOrder : createOrder}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Folio"
				name="folio"
				variant="outlined"
				defaultValue={OrderData?.folio}
				type="text"
				required
				disabled
			/>
			<TextField
				sx={{ width: "300px" }}
				name="amount"
				label="Cantidad Pagada"
				placeholder="Placeholder"
				inputProps={{ inputMode: "numeric", pattern: "[0-9].*" }}
				defaultValue={OrderData?.amount}
				variant="outlined"
				required
			/>
			<FormGroup>
				<InputLabel>Estado</InputLabel>
				<Select
					label="Estado"
					sx={{ width: "300px", color: "inherit" }}
					defaultValue={OrderData?.state ?? "NA"}
					name="state"
				>
					{orderSate?.map((order) => (
						<MenuItem key={order} value={order}>
							{order}
						</MenuItem>
					))}
				</Select>
			</FormGroup>

			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default OrdersForm;
