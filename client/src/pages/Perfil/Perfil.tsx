import Navbar from "@/Navbar/Navbar";
import React, { useState, useContext } from "react";

import { useSnackbar } from "notistack";
import {
	Avatar,
	Box,
	Button,
	Container,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Paper,
	TextField,
} from "@mui/material";
import vendor from "../../assets/vendor.png";
import helper from "../../assets/helper.png";
import admin from "../../assets/admin.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AxiosError } from "axios";
import { instance } from "helper/API";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import LoginContext from "../../context/LoginContext";
import { useTheme } from "@mui/material/styles";

const Perfil = () => {
	const userData: User | null = useReadLocalStorage("log_in");
	const theme = useTheme();

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
	 * Determines if the password and cellphone fields will be
	 * enabled, wether the user is or not editing those
	 */
	const [isEditing, setIsEditing] = useState(false);

	const { handleLogin } = useContext(LoginContext);

	/**
	 * Updates the DB with the new password and cellphone
	 * provided by the user
	 *
	 * @param event that contains the info of the new data
	 */
	async function submitNewData(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get password and cellphone from the form
		const data = new FormData(event.currentTarget);
		const password = data.get("password")?.toString();
		const cellphone = data.get("cellphone")?.toString();

		// Upload data to DB
		try {
			const user: User = (
				await instance.put("/users/updateProfile", {
					id: userData?.id,
					pass: password,
					cel: cellphone,
				})
			).data;

			console.log(user);
			handleLogin(user);
			enqueueSnackbar("Datos actualizados con exito", { variant: "success" });
			setIsEditing(false);
		}
		catch (error) {
			if (error instanceof AxiosError && error.response?.status === 409) {
				enqueueSnackbar(
					"Ya hay un usuario con ese numero, intenta otro diferente",
					{ variant: "error" }
				);
			}
			else enqueueSnackbar("Algo salio mal", { variant: "error" });
		}
	}

	return (
		<>
			<Navbar />

			<Container
				sx={{
					width: "500px",
					marginTop: "20px",
					marginBottom: "20px",
					color: theme.palette.text.primary,
				}}
			>
				<h1>Perfil</h1>
				<Paper
					elevation={12}
					sx={{
						display: "flex",
						flexDirection: "column",
						padding: "20px",
						gap: "20px",
						color: theme.palette.text.primary,
					}}
				>
					<Box
						sx={{
							marginBottom: "20px",
							display: "flex",
							alignItems: "center",
							gap: "20px",
							color: theme.palette.text.primary,
						}}
					>
						<Avatar
							alt={userData?.name}
							src={
								userData?.type_use === "vendedor"
									? vendor
									: userData?.type_use === "admin"
										? admin
										: helper
							}
							sx={{
								width: "140px",
								height: "140px",
							}}
						/>

						<h2 style={{ flexGrow: 1, fontSize: "30px" }}>{userData?.name}</h2>
					</Box>

					<Box
						component="form"
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: "20px",
						}}
						onSubmit={submitNewData}
					>
						<TextField
							label="Usuario"
							name="username"
							variant="outlined"
							defaultValue={userData?.name}
							type="text"
							required
							disabled
							InputLabelProps={{
								sx: {
									color:
										theme.palette.mode === "light"
											? theme.palette.text.primary
											: theme.palette.text.secondary,
								},
							}}
							InputProps={{
								sx: {
									opacity: 0.5, // Adjust the opacity value to your liking
									// Add any other styles you want for disabled state
								},
							}}
						/>
						<FormControl>
							<InputLabel
								htmlFor="password"
								sx={{
									color:
										theme.palette.mode === "light"
											? theme.palette.text.primary
											: theme.palette.text.secondary,
								}}
							>
								Contraseña
							</InputLabel>
							<OutlinedInput
								id="pass"
								label="Contraseña"
								name="password"
								type={showPassword ? "text" : "password"}
								defaultValue={userData?.pass}
								disabled={!isEditing}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											edge="end"
											sx={{ color: theme.palette.text.primary }}
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
								sx={{
									opacity: 0.5, // Adjust the opacity value to your liking
									// Add any other styles you want for disabled state
								}}
							/>
						</FormControl>
						<TextField
							label="Tipo"
							variant="filled"
							value={userData?.type_use}
							type="text"
							sx={{
								color:
									theme.palette.mode === "light"
										? theme.palette.text.primary
										: theme.palette.text.secondary,
								opacity: 0.5, // Adjust the opacity value to your liking
								// Add any other styles you want for disabled state
							}}
							disabled
						/>
						<TextField
							label="Celular"
							id="cell"
							name="cellphone"
							variant="outlined"
							defaultValue={userData?.cel}
							sx={{
								color:
									theme.palette.mode === "light"
										? theme.palette.text.primary
										: theme.palette.text.secondary,
							}}
							type="text"
							inputProps={{
								pattern: "^\\d{2}-\\d{4}-\\d{4}$",
								maxLength: 12,
								inputMode: "numeric",
							}}
							required
							disabled={!isEditing}
							InputProps={{
								sx: {
									opacity: 0.5, // Adjust the opacity value to your liking
									// Add any other styles you want for disabled state
								},
							}}
						/>
						{!isEditing ? (
							<Button
								variant="contained"
								color="primary"
								onClick={() => setIsEditing(true)}
							>
								Editar
							</Button>
						) : (
							<></>
						)}
						{isEditing ? (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Button
									sx={{ width: "250px" }}
									variant="contained"
									type="submit"
									color="warning"
								>
									Actualizar datos
								</Button>

								<Button
									sx={{ width: "150px" }}
									variant="contained"
									color="error"
									onClick={() => setIsEditing(false)}
								>
									Cancelar
								</Button>
							</Box>
						) : (
							<></>
						)}
					</Box>
				</Paper>
			</Container>
		</>
	);
};

export default Perfil;
