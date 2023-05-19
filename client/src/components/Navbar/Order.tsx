import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { QueryOrder } from "./SearchAppBar";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	useTheme,
} from "@mui/material";

interface PropsOrder {
	value: string | null;
	handleChangeOrder: (
		event: SelectChangeEvent<string>,
		child: ReactNode
	) => void;
}

export const Order: React.FC<PropsOrder> = ({ handleChangeOrder, value }) => {
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
