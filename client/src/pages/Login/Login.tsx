import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";

const Login: React.FC = () => {
	/**
	 * Determines if the password will be shown or hidden
	 * in its input field
	 */
	const [showPassword, setShowPassword] = useState(false);

	// Helps when taking user to another section of the page
	const navigate = useNavigate();

	async function authenticate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get data from the form
		const data = new FormData(event.currentTarget);
		const username = data.get("username");
		const cellphone = data.get("cellphone");
		const password = data.get("password");
		const userWantsToBeRemembered = data.get("remember") === "on";

		// TODO: Authenticate user
		console.table({ username, cellphone, password, userWantsToBeRemembered });
		const userWasAuthenticated = true;

		if (userWasAuthenticated) {
			if (userWantsToBeRemembered) storeUserAuthentication();

			navigate("/home");
		}
	}

	// TODO: Create store user authentication logic
	function storeUserAuthentication() {}

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
				onSubmit={authenticate}
			>
				<Avatar sx={{ padding: "10px" }}>
					<Lock fontSize="large" />
				</Avatar>

				<TextField
					sx={{ width: "300px" }}
					label="Usuario"
					name="username"
					variant="outlined"
					type="text"
					required
				/>

				<TextField
					sx={{ width: "300px" }}
					label="Telefono"
					name="cellphone"
					variant="outlined"
					type="text"
					required
				/>

				<FormControl sx={{ width: "300px" }}>
					<InputLabel htmlFor="password">Contraseña</InputLabel>
					<OutlinedInput
						id="password"
						label="Contraseña"
						name="password"
						type={showPassword ? "text" : "password"}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									edge="end"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>

				<Button type="submit" variant="contained" fullWidth>
					Iniciar Sesion
				</Button>

				<FormControlLabel
					name="remember"
					sx={{ alignSelf: "flex-start" }}
					label="Recuérdame"
					control={<Checkbox />}
				/>
			</Box>
		</div>
	);
};

export default Login;
