import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { instance } from "helper/API";

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
import { ServerResponse } from "models/ServerResponse";
import Cookies from "universal-cookie";
import { DeleteProps } from "helper/DeleteProps";

interface FormLogin {
	name: string;
	pass: string;
	cel: string;
}

const cookies = new Cookies();

const Login: React.FC = () => {
	/**
	 * Determines if the password will be shown or hidden
	 * in its input field
	 */
	const [showPassword, setShowPassword] = useState(false);

	// Helps when taking user to another section of the page
	const navigate = useNavigate();

	const validationsForm = (form: FormLogin) => {
		const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
		const regexNum = /^[2-9]{2}-{1}[0-9]{4}-{1}[0-9]{4}$/;
		const regexPass =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
		const regexSigns = /[-<>/]+/g;
		const errors = {};

		if (!form.name.trim()) alert("Llena el campo nombre");
		else if (!regexName.test(form.name.trim()))
			alert("El campo nombre solo acepta letras y espcios en blanco ' '");

		if (!form.pass.trim()) alert("El campo contraseña es requerido");
		else if (
			!regexPass.test(form.pass.trim()) ||
			regexSigns.test(form.pass.trim())
		)
			alert("Debe ser una contraseña robusta y no se permiten \"-<>/</>\"");

		if (!form.cel.trim()) alert("Llena el campo celular");
		else if (!regexNum.test(form.cel.trim())) {
			alert(
				"El campo celular solo acepta numeros y no mas de 10 digitos, (XX-XXXX-XXXX)"
			);
		}
		return errors;
	};

	async function authenticate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get data from the form
		const data = new FormData(event.currentTarget);
		const username = data.get("username")?.toString();
		const cellphone = data.get("cellphone")?.toString();
		const password = data.get("password")?.toString();
		const userWantsToBeRemembered = data.get("remember") === "on";

		const userLog = {
			name: username,
			pass: password,
			cel: cellphone,
		};

		console.table({ username, cellphone, password, userWantsToBeRemembered });

		const url = "/users/login";
		try {
			const response = await instance.post<ServerResponse>(url, userLog);
			const user = await response.data;

			console.log(user);
			let userWasAuthenticated: boolean | undefined = user?.err;

			userWasAuthenticated = userWasAuthenticated ?? true;

			if (!userWasAuthenticated) {
				DeleteProps(user?.success, ["createdAt", "updatedAt"]);
				if (userWantsToBeRemembered) storeUserAuthentication(user);

				navigate("/inicio");
			}
			else {
				const message = user?.statusText;
				const status = user?.status;
				throw { message, status };
			}
		}
		catch (error: any) {
			alert(
				`Descripcion del error: ${error.message}\nEstado: ${
					error?.status ?? 500
				}`
			);
		}
	}

	// TODO: Create store user authentication logic
	function storeUserAuthentication(user: ServerResponse | undefined) {
		cookies.set("user", user?.success, { path: "/" });
	}

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
