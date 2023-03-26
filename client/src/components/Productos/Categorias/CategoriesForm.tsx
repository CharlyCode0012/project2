import {
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	Switch,
	TextField,
} from "@mui/material";
import React from "react";

const CategoriesForm = () => {
	const handleSubmit = () => {};
	return (
		<div className="login">
			<Box
				component="form"
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "1rem",
				}}
				onSubmit={handleSubmit}
			>
				<TextField
					sx={{ width: "300px" }}
					label="Nombre"
					name="name"
					variant="outlined"
					type="text"
					required
				/>
				<FormGroup>
					<FormControlLabel
						control={<Switch defaultChecked />}
						label="Estado"
					/>
				</FormGroup>
				<Button type="submit" variant="contained" fullWidth>
					Enviar
				</Button>
			</Box>
		</div>
	);
};

export default CategoriesForm;
