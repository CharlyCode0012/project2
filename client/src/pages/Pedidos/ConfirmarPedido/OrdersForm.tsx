import React from "react";
import {
	Box,
	Button,
	FormGroup,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Order } from "models/Order";
import { instance, instanceBot } from "helper/API";
import { useSnackbar } from "notistack";

interface OrdersFormProps {
	onSubmit: (op: boolean) => void;
	OrderData?: Order;
}

const orderSate = ["Pagado", "Abonado", "NA"];

const OrdersForm: React.FC<OrdersFormProps> = ({ onSubmit, OrderData }) => {
	const { enqueueSnackbar } = useSnackbar();

	function isNumeric(value: string): boolean {
		// Utiliza una expresión regular para verificar si el valor es numérico
		return /^\d*(\.\d{1})?\d{0,1}$/.test(value);
	}

	async function updateOrder(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const folio = OrderData?.folio;
		const amount = data.get("amount")?.toString();
		const state = data.get("state")?.toString();

		console.log("state: ", state, "folio: ", folio);
		const endpoint = `/orders/${OrderData?.id}`;

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
			if (state !== "NA") {
				instanceBot.post("/sendConfirmDate", {
					folio,
					message: "Se ha aprobado tu pedido",
					to: OrderData?.id_client,
				});
			}

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
			onSubmit={updateOrder}
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
