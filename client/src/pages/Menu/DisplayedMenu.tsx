import { AddCircle } from "@mui/icons-material";
import { IconButton, Paper, TextField } from "@mui/material";
import { MenuData } from "models/Menu";
import React from "react";

export interface DisplayedMenuProps {
	data: MenuData;
}

const DisplayedMenu: React.FC<DisplayedMenuProps> = ({ data }) => {

	function addOption() {
		// TODO: Give body to function
	}

	return (
		<Paper
			elevation={32}
			sx={{
				display: "flex",
				flexDirection: "column",
				padding: "20px",
				gap: "20px",
			}}
		>

			<TextField
				label="Titulo"
				name="title"
				variant="outlined"
				defaultValue={data.title}
				type="text"
				required
			/>
			
			<TextField
				label="Instruccion"
				name="instruccion"
				variant="standard"
				defaultValue={data.instruction}
				type="text"
				multiline
				rows={4}
				required
				helperText={ "Maximo 300 caracteres" }
			/>

			<h4>Opciones</h4>

			<IconButton
				sx={{ alignSelf: "flex-start", fontSize: "40px", padding: "0px" }}
				onClick={() => addOption()}
			>
				<AddCircle fontSize="inherit" />
			</IconButton>
			
			<TextField
				label="Instruccion"
				name="instruccion"
				variant="standard"
				defaultValue={data.instruction}
				type="text"
				required
			/>
			
		</Paper>
	);
};

export default DisplayedMenu;
