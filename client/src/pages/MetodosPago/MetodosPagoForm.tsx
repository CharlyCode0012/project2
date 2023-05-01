import React from "react";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { instance } from "helper/API";
import { PaymentMethod } from "models/PaymentsMethod";

interface PaymentMethodFormProps {
	paymentMethodData?: PaymentMethod;
	onSubmit: (wasAnUpdate: boolean) => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
	paymentMethodData,
	onSubmit,
}) => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Takes what was filled in the form and saves a new
	 * payment method in the DB
	 *
	 * @param event Form event that contains all of its info
	 */
	async function createPaymentMethod(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const owner = data.get("titular")?.toString();
		const clabe = data.get("clabe")?.toString();
		const cardNumber = data.get("no-tarjeta")?.toString();
		const bank = data.get("banco")?.toString();
		const placesToPay = data.get("lugares-pago")?.toString();

		// Upload data to DB
		try {
			await instance.post("/payment_methods", {
				id: Date.now().toString(),
				name: owner,
				CLABE: clabe,
				no_card: cardNumber,
				bank,
				subsidary: placesToPay,
			});

			onSubmit(false); // "false" tells the submission wasn't an update, it was a new payment method creation
		}
		catch {
			enqueueSnackbar("Algo salio mal", { variant: "error" });
		}
	}

	/**
	 * Takes what was filled in the form and updates the data
	 * from the given payment method in the DB
	 *
	 * @param event Form event that contains all of its info
	 */
	async function updatePaymentMethod(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const owner = data.get("titular")?.toString();
		const clabe = data.get("clabe")?.toString();
		const cardNumber = data.get("no-tarjeta")?.toString();
		const bank = data.get("banco")?.toString();
		const placesToPay = data.get("lugares-pago")?.toString();

		// Update data to DB
		try {
			await instance.put(`/payment_methods/${paymentMethodData?.id}`, {
				name: owner,
				CLABE: clabe,
				no_card: cardNumber,
				bank,
				subsidary: placesToPay,
			});

			onSubmit(true); // "true" tells the submission was an update
		}
		catch {
			enqueueSnackbar("Algo salio mal", { variant: "error" });
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
			onSubmit={paymentMethodData ? updatePaymentMethod : createPaymentMethod}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Titular"
				name="titular"
				variant="outlined"
				defaultValue={paymentMethodData?.name}
				type="text"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				label="CLABE"
				name="clabe"
				variant="outlined"
				defaultValue={paymentMethodData?.CLABE}
				type="text"
				required
			/>
			<TextField
				sx={{ width: "300px" }}
				label="No. Tarjeta"
				name="no-tarjeta"
				variant="outlined"
				defaultValue={paymentMethodData?.no_card}
				type="text"
				inputProps={{
					pattern: "[0-9]{16}",
					maxLength: 16,
					inputMode: "numeric",
				}}
				required
			/>
			<FormControl>
				<InputLabel>Filtrar por</InputLabel>

				<Select
					defaultValue={"Santander"}
					label="Filtrar por"
					sx={{ width: "300px" }}
					name="banco"
				>
					<MenuItem value={"Santander"}>{"Santander"}</MenuItem>
					<MenuItem value={"BBVA Bancomer"}>{"BBVA Bancomer"}</MenuItem>
					<MenuItem value={"Citianamex"}>{"Citibabnamex"}</MenuItem>
					<MenuItem value={"Banorte"}>{"Banorte"}</MenuItem>
					<MenuItem value={"Scotiabank"}>{"Scotiabank"}</MenuItem>
					<MenuItem value={"HSBC"}>{"HSBC"}</MenuItem>
				</Select>
			</FormControl>
			<TextField
				sx={{ width: "300px" }}
				label="Lugares para pagar"
				name="lugares-pago"
				variant="outlined"
				defaultValue={paymentMethodData?.subsidary}
				type="text"
				required
			/>
			<Button type="submit" variant="contained" fullWidth>
				{paymentMethodData ? "Actualizar" : "Crear"}
			</Button>
		</Box>
	);
};

export default PaymentMethodForm;
