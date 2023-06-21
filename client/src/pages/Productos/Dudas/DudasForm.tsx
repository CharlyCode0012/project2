import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Question } from "models/Question";
import { instance, instanceBot } from "helper/API";
import { useSnackbar } from "notistack";

interface DudasFormProps {
	onSubmit: (op: boolean) => void;
	questionData?: Question;
}

const DudasForm: React.FC<DudasFormProps> = ({ onSubmit, questionData }) => {
	const { enqueueSnackbar } = useSnackbar();

	async function updateQuestion(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get payment method data from the form
		const data = new FormData(event.currentTarget);
		const answer = data.get("answer")?.toString();
		const state = answer ? true : false;

		console.log("answer: ", answer);
		console.log("state: ", state);
		const endpoint = `/questions/${questionData?.id}`;

		try {
			console.log(`update endpoint: ${endpoint}`);

			await instance.put(endpoint, {
				state,
				answer,
				to: questionData?.id_client ?? "",
			});

			/* await instanceBot.post("/sendAnswer", {
				product: questionData?.product_name,
				answer,
				to: questionData?.id_client ?? "",
			}); */

			await instanceBot.post("/sendAnswer", {
				question: questionData?.question,
				product: questionData?.product_name,
				answer,
				to: questionData?.id_client ?? "",
			});

			onSubmit(true);
		}
		catch {
			enqueueSnackbar("Error al respoder", { variant: "error" });
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
			onSubmit={updateQuestion}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Responder"
				name="answer"
				multiline
				variant="outlined"
				type="text"
				required
			/>
			<Button type="submit" variant="contained" fullWidth>
				Enviar
			</Button>
		</Box>
	);
};

export default DudasForm;
