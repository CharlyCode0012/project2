import React from "react";
import { Box, Button } from "@mui/material";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

export const Config: React.FC = () => {
	const num = 0;
	const navigate = useNavigate();

	function onClose(): void {
		cookies.remove("user");
		cookies.remove("log_in");
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
					<Button variant="contained" color="error" fullWidth onClick={onClose}>
						Cerrar Sesion
					</Button>
				</Box>
			</Box>
		</>
	);
};
