import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "App";

export const ButtonTheme: React.FC = () => {
	const theme = useTheme();
	const colorMode = React.useContext(ColorModeContext);
	return (
		<IconButton
			sx={{ ml: 1, color: theme.palette.text.primary }}
			onClick={colorMode.toggleColorMode}
		>
			{theme.palette.mode === "dark" ? (
				<Brightness7Icon />
			) : (
				<Brightness4Icon />
			)}
		</IconButton>
	);
};
