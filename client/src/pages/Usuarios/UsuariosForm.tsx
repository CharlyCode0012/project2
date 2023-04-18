import React, { useState } from "react";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { instance } from "helper/API";
import { User } from "models/User";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AxiosError } from "axios";

interface UserFormProps {
	userData?: User;
	onSubmit: (wasAnUpdate: boolean) => void;
}

const UserForm: React.FC<UserFormProps> = ({
	userData,
	onSubmit,
}) => {
	/**
	 * Displays notifications to the user
	 */
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Determines if the password will be shown or hidden
	 * in its input field
	 */
	const [showPassword, setShowPassword] = useState(false);

	/**
	 * Takes what was filled in the form and saves a new
	 * user in the DB
	 * 
	 * @param event Form event that contains all of its info
	 */
	async function createUser (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get user data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const birthday = data.get("date_B")?.toString();
		const userType = data.get("type_use")?.toString().toLowerCase();
		const email = data.get("e_mail")?.toString();
		const password = data.get("pass")?.toString();
		const cellphone = data.get("cel")?.toString();

		// Upload data to DB
		try {
			await instance.post("/users", {
				id: Date.now().toString(),
				name,
				date_B: new Date(birthday ?? "01-01-2000"),
				type_use: userType,
				e_mail: email,
				pass: password,
				cel: cellphone
			} as User);

			onSubmit(false); // "false" tells the submission wasn't an update, it was a new user creation
		}

		catch (error) {
			if (error instanceof AxiosError && error.response?.status === 409) 
				enqueueSnackbar("Ya hay un usuario con ese numero, intenta otro diferente", { variant: "error" });	
				
			else
				enqueueSnackbar("Algo salio mal", { variant: "error" });
		}
	}

	/**
	 * Takes what was filled in the form and updates the data
	 * from the given user in the DB
	 * 
	 * @param event Form event that contains all of its info
	 */
	async function updateUser (event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get user data from the form
		const data = new FormData(event.currentTarget);
		const name = data.get("name")?.toString();
		const birthday = data.get("date_B")?.toString();
		const userType = data.get("type_use")?.toString();
		const email = data.get("e_mail")?.toString();
		const password = data.get("pass")?.toString();
		const cellphone = data.get("cel")?.toString();

		// Update data to DB
		try {
			await instance.put(`/users/${userData?.id}`, {
				name,
				date_B: new Date(birthday ?? "2000-01-01"),
				type_use: userType,
				e_mail: email,
				pass: password,
				cel: cellphone
			} as User);

			onSubmit(true); // "true" tells the submission was an update
		}

		catch (error) {
			if (error instanceof AxiosError && error.response?.status === 409) 
				enqueueSnackbar("Ya hay un usuario con ese numero, intenta otro diferente", { variant: "error" });	
				
			else
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
			onSubmit={userData ? updateUser : createUser}
		>
			<TextField
				sx={{ width: "300px" }}
				label="Nombre"
				name="name"
				variant="outlined"
				defaultValue={userData?.name}
				type="text"
				required
			/>

			<TextField
				sx={{ width: "300px" }}
				label="Fecha de nacimiento"
				name="date_B"
				variant="outlined"
				defaultValue={userData?.date_B}
				type="date"
				required
			/>

			<FormControl>
				<InputLabel>Filtrar por</InputLabel>

				<Select
					defaultValue={"Ayudante"}
					label="Tipo de usuario"
					name="type_use"
					sx={{ width: "300px" }}
				>
					<MenuItem value={"Admin"}>{"Admin"}</MenuItem>
					<MenuItem value={"Ayudante"}>{"Ayudante"}</MenuItem>
				</Select>
			</FormControl>

			<TextField
				sx={{ width: "300px" }}
				label="Correo"
				name="e_mail"
				variant="outlined"
				defaultValue={userData?.e_mail}
				type="email"
				required
			/>

			<FormControl sx={{ width: "300px" }}>
				<InputLabel htmlFor="password">Contraseña</InputLabel>
				<OutlinedInput
					id="pass"
					label="Contraseña"
					name="pass"
					type={showPassword ? "text" : "password"}
					defaultValue={userData?.pass}
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

			<TextField
				sx={{ width: "300px" }}
				label="Celular"
				name="cel"
				variant="outlined"
				defaultValue={userData?.pass}
				type="text"
				inputProps={{ pattern: "^\\d{2}-\\d{4}-\\d{4}$", maxLength: 12, inputMode: "numeric" }}
				required
			/>

			<Button type="submit" variant="contained" fullWidth>
				{ userData ? "Actualizar" : "Crear" }
			</Button>
		</Box>
	);
};

export default UserForm;
