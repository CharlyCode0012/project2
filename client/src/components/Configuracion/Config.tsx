import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginContext from "context/LoginContext";
import { useReadLocalStorage } from "usehooks-ts";
import { User } from "models/User";

export const Config: React.FC = () => {
	const { handleLogin } = useContext(LoginContext);
	const navigate = useNavigate();
	const userLogin: User | null = useReadLocalStorage("log_in");
	const typeUser: string | undefined = userLogin?.type_use;
	const isVendedor: boolean = typeUser === "vendedor" ? true : false;

	function onClose(): void {
		handleLogin(null);
		navigate("/", { replace: true });
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
