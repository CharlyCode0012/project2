import React, { useContext, useEffect, useState } from "react";
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
import { useSnackbar } from "notistack";
import Cookies from "universal-cookie";
import { DeleteProps } from "helper/DeleteProps";
import LoginContext from "context/LoginContext";

interface FormLogin {
	name: string;
	pass: string;
	cel: string;
}

const initialForm: FormLogin = {
	name: "",
	pass: "",
	cel: "",
};

const cookies = new Cookies();

const Login: React.FC = () => {
	/**
	 * Determines if the password will be shown or hidden
	 * in its input field
	 */
	// const { form, handleChange, setInfo } = useForm<FormLogin>(initialForm);
	const { enqueueSnackbar } = useSnackbar();
	const [form, setForm] = useState<FormLogin>(initialForm);
	const [showPassword, setShowPassword] = useState(false);

	const { handleLogin } = useContext(LoginContext);
	// Helps when taking user to another section of the page
	const navigate = useNavigate();

	function setInfo(data: FormLogin) {
		setForm(data);
	}

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	}

	// TODO: Create store user authentication logic
	function storeUserAuthentication(user: ServerResponse | undefined) {
		cookies.set("user", user?.success, { path: "/" });
	}

	function validationsForm(form: FormLogin) {
		const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
		const regexNum = /^[2-9]{2}-{1}[0-9]{4}-{1}[0-9]{4}$/;
		const regexPass =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
		const regexSigns = /[-<>/]+/g;
		const errors: any = {};

		if (!form.name.trim()) errors.name = "Llena el campo nombre";
		else if (!regexName.test(form.name.trim())) {
			errors.name =
				"El campo nombre solo acepta letras y espacios en blanco ' '";
		}

		if (!form.pass.trim()) errors.pass = "El campo contraseña es requerido";
		else if (
			!regexPass.test(form.pass.trim()) ||
			regexSigns.test(form.pass.trim())
		) {
			errors.pass =
				"Debe ser una contraseña robusta y no se permiten \"-<>/</>\"";
		}

		if (!form.cel.trim()) errors.cel = "Llena el campo celular";
		else if (!regexNum.test(form.cel.trim())) {
			errors.cel =
				"El campo celular solo acepta números y no más de 10 dígitos, (XX-XXXX-XXXX)";
		}

		return errors;
	}

	async function authenticate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const validationErrors = validationsForm(form);
		if (Object.keys(validationErrors).length > 0) {
			const errorMessage = Object.values(validationErrors).join("\n");
			enqueueSnackbar(errorMessage, { variant: "warning" });
			return;
		}

		// Get data from the form
		const data = new FormData(event.currentTarget);
		const username = data.get("name")?.toString();
		const cellphone = data.get("cel")?.toString();
		const password = data.get("pass")?.toString();
		const userWantsToBeRemembered = data.get("remember") === "on";

		const userLog = {
			name: username,
			pass: password,
			cell: cellphone,
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

				handleLogin(user?.success);
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
			enqueueSnackbar(
				`Descripcion del error: ${error.message}\nEstado: ${
					error?.status ?? 500
				}`,
				{ variant: "error" }
			);
		}
	}

	useEffect(() => {
		if (cookies.get("user") || cookies.get("user") !== undefined) {
			const { name, pass, cel } = cookies.get("user");
			const rememberedUser: FormLogin = { name: name, pass: pass, cel: cel };
			setInfo(rememberedUser);
		}
	}, []);

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
					name="name"
					value={form.name}
					variant="outlined"
					type="text"
					onChange={handleChange}
					required
				/>

				<TextField
					sx={{ width: "300px" }}
					label="Telefono"
					name="cel"
					variant="outlined"
					type="text"
					value={form.cel}
					onChange={handleChange}
					required
				/>

				<FormControl sx={{ width: "300px" }}>
					<InputLabel htmlFor="password">Contraseña</InputLabel>
					<OutlinedInput
						id="pass"
						label="Contraseña"
						name="pass"
						type={showPassword ? "text" : "password"}
						value={form.pass}
						onChange={handleChange}
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
