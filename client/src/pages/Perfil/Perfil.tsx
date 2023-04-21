import Navbar from "@/Navbar/Navbar";
import React, { useState } from "react";
import Cookies from "universal-cookie";

import { Avatar, Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material";
import vendor from "../../assets/vendor.png";
import helper from "../../assets/helper.png";
import admin from "../../assets/admin.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Perfil = () => {
	const cookies = new Cookies();
	const userData = cookies.get("user");

	/**
	 * Determines if the password will be shown or hidden
	 * in its input field
	 */
	const [showPassword, setShowPassword] = useState(false);


	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Navbar />

			<Container
				sx={{
					width: "500px",
					marginTop: "20px",
					marginBottom: "20px",
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
					}}
				>
					<Box
						sx={{
							marginBottom: "20px",
							display: "flex",
							alignItems: "center",
							gap: "20px"
						}}
					>
						<Avatar
							alt={userData.name}
							src={userData.type_use === "vendedor" ? vendor : (userData.type_use === "admin" ? admin : helper)}
							sx={{
								width: "140px",
								height: "140px",
							}}
						/>

						<h2 style={{ flexGrow: 1, fontSize: "30px" }}>{userData.name}</h2>
					</Box>

					<TextField
						label="Usuario"
						name="username"
						variant="outlined"
						defaultValue={userData.name}
						type="text"
						required
						disabled={!isEditing}
					/>

					<FormControl>
						<InputLabel htmlFor="password">Contraseña</InputLabel>
						<OutlinedInput
							id="pass"
							label="Contraseña"
							name="password"
							type={showPassword ? "text" : "password"}
							value={userData.pass}
							disabled={!isEditing}
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
						label="Tipo"
						variant="filled"
						value={userData.type_use}
						type="text"
						disabled
					/>

					<TextField
						label="Celular"
						name="cellphone"
						variant="outlined"
						defaultValue={userData.cel}
						type="text"
						inputProps={{ pattern: "^\\d{2}-\\d{4}-\\d{4}$", maxLength: 12, inputMode: "numeric" }}
						required
						disabled={!isEditing}
					/>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "20px"
						}}
					>
						<Button variant="contained">Editar</Button>
					</Box>

				</Paper>
			</Container>
		</>
	);
};

export default Perfil;
