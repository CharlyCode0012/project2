import React from "react";
import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
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

const OrdersForm: React.FC<OrdersFormProps> = ({ onSubmit, OrderData }) => {
	const { enqueueSnackbar } = useSnackbar();

	async function createOrder(event: React.FormEvent<HTMLFormElement>) {
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
			await instance.post("/orders", {
				id: Date.now().toString(),
				name,
				state,
				description,
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
		const name = data.get("name")?.toString();
		const description = data.get("description")?.toString();
		const actived = data.get("state")?.toString();
		const state = actived ? true : false;

		console.log("name: ", name);
		console.log("state: ", state);
		const endpoint = `/orders/${OrderData?.id}`;

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
				name="description"
				label="Descripcion"
				placeholder="Placeholder"
				multiline
				variant="outlined"
				color="primary"
				required
			/>
			<FormGroup>
				<FormControlLabel
					control={<Switch name="state" defaultChecked={OrderData?.state} />}
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
