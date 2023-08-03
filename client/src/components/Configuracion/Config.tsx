import React, { useContext, useState } from "react";
import { Box, Button, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginContext from "context/LoginContext";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import Cookies from "universal-cookie";
import { ThemeName } from "../../themes/themes";
import { ThemeContext } from "App";
import { instanceBot } from "helper/API";

export const Config: React.FC = () => {
	const { handleLogin } = useContext(LoginContext);
	const { setThemeName } = useContext(ThemeContext);
	const navigate = useNavigate();
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isVendedor: boolean = typeUser === "vendedor" ? true : false;

	const [botState, setBotState] = useState(true); // Assuming the bot is initially turned on.

	function onClose(): void {
		handleLogin(null);
		navigate("/", { replace: true });
	}

	const selectTheme = (themeName: ThemeName) => {
		setThemeName(themeName);
	};

	async function toggleBotState() {
		try {
			const response = await instanceBot.get(botState ? "/off" : "/on");
			// Assuming the server will respond with 'APAGADO' when turning the bot off,
			// and 'PRENDIDO' when turning it on.
			if (response.data === "APAGADO") setBotState(false);
			else if (response.data === "PRENDIDO") setBotState(true);
		}
		catch (error) {
			// Handle error if needed
			console.error("Error while toggling bot state:", error);
		}
	}

	return (
		<>
			<Box
				sx={{
					height: "560px",
					flexGrow: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
						}}
					>
						<Box
							sx={{
								width: "50px",
								height: "50px",
								backgroundColor: "green",
							}}
							onClick={() => selectTheme("green")}
						/>
						<Box
							sx={{
								width: "50px",
								height: "50px",
								backgroundColor: "blue",
							}}
							onClick={() => selectTheme("blue")}
						/>
						<Box
							sx={{
								width: "50px",
								height: "50px",
								backgroundColor: "red",
							}}
							onClick={() => selectTheme("red")}
						/>
					</Box>
					{isVendedor && (
						<>
							<img
								src={"https://chatbot-production-f3e4.up.railway.app/QR"}
								style={{ width: "250px", height: "250px" }}
								alt="Codigo QR"
							></img>
							<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
								<span>Bot: {botState ? "Encendido" : "Apagado"}</span>
								<Switch
									checked={botState}
									onChange={toggleBotState}
									color="primary"
								/>
							</Box>
						</>
					)}

					<Button variant="contained" color="error" fullWidth onClick={onClose}>
						Cerrar Sesion
					</Button>
				</Box>
			</Box>
		</>
	);
};
