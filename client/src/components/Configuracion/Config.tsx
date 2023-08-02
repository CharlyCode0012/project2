import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginContext from "context/LoginContext";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";
import Cookies from "universal-cookie";
import { ThemeName } from "../../themes/themes";
import { ThemeContext } from "App";

export const Config: React.FC = () => {
	const { handleLogin } = useContext(LoginContext);
	const { setThemeName } = useContext(ThemeContext);
	const navigate = useNavigate();
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isVendedor: boolean = typeUser === "vendedor" ? true : false;

	function onClose(): void {
		handleLogin(null);
		navigate("/", { replace: true });
	}

	const selectTheme = (themeName: ThemeName) => {
		setThemeName(themeName);
	};

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
						<img
							src={"http://127.0.0.1:3500/QR"}
							style={{ width: "250px", height: "250px" }}
							alt="Codigo QR"
						></img>
					)}
					<Button variant="contained" color="error" fullWidth onClick={onClose}>
						Cerrar Sesion
					</Button>
				</Box>
			</Box>
		</>
	);
};
