import React, { ReactNode } from "react";

import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	useTheme,
} from "@mui/material";

interface PropsOrder {
	handleChangeOrder: (
		event: SelectChangeEvent<string>,
		child: ReactNode
	) => void;
}

export const Order: React.FC<PropsOrder> = ({ handleChangeOrder }) => {
	const theme = useTheme();

	return (
		<FormControl
			sx={{ marginRight: "40px" }}
			color={theme.palette.mode === "dark" ? "secondary" : "warning"}
		>
			<InputLabel sx={{ color: "inherit" }}>Filtrar por</InputLabel>

			<Select
				defaultValue="ASC"
				label="Filtrar por"
				sx={{ width: "200px", color: "inherit" }}
				onChange={handleChangeOrder}
			>
				<MenuItem value={"ASC"}>ASC</MenuItem>
				<MenuItem value={"DESC"}>DESC</MenuItem>;
			</Select>
		</FormControl>
	);
};
