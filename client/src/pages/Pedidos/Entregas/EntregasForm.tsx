import React from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Switch,
	TextField,
} from "@mui/material";
import { Delivery } from "models/Delivery";
import { instance } from "helper/API";
import { useSnackbar } from "notistack";

interface OrdersFormProps {
	onSubmit: (op: boolean) => void;
	DeliveryData?: Delivery;
}

const OrdersForm: React.FC<OrdersFormProps> = ({ onSubmit, DeliveryData }) => {
	const { enqueueSnackbar } = useSnackbar();

	async function createOrder(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const folio = data.get("folio")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		try {
			await instance.post("/deliveries", {
				id: Date.now().toString(),
				folio,
				state,
			});
			onSubmit(false); // "false" tells the submission wasn't an update, it was a new Delivery creation
		}
		catch (error: any) {
			enqueueSnackbar("Error al crear la entrega", { variant: "error" });
			console.log(error);
		}
	}

	async function updateOrder(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const folio = data.get("folio")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("state: ", state);
		const endpoint = `/deliveries/id/${DeliveryData?.id}`;

		try {
			console.log(`update endpoint: ${endpoint}`);

			await instance.put(endpoint, {
				folio,
				state,
			});
			onSubmit(true);
		}
		catch (error: any) {
			enqueueSnackbar("Error al actualizar la entrega", { variant: "error" });
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
			onSubmit={DeliveryData ? updateOrder : createOrder}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Folio"
				name="folio"
				variant="outlined"
				defaultValue={DeliveryData?.folio}
				type="text"
				required
				disabled
			/>
			<FormGroup>
				<FormControlLabel
					control={<Switch name="state" defaultChecked={DeliveryData?.state} />}
					label="Estado"
				/>
			</FormGroup>

			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default OrdersForm;
