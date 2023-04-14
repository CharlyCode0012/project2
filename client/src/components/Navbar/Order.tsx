import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { QueryOrder } from "./SearchAppBar";

interface PropsOrder {
	value: string | null;
	handleChangeOrder: (option: QueryOrder | null) => void;
}

export const Order: React.FC<PropsOrder> = ({ handleChangeOrder, value }) => {
	const num = 0;
	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={Options}
			value={value}
			sx={{ width: 150 }}
			onChange={(
				event: React.SyntheticEvent<Element, Event>,
				newValue: string | null
			) => {
				handleChangeOrder(newValue as QueryOrder);
			}}
			renderInput={(params) => <TextField {...params} label="Orden" />}
		/>
	);
};

const Options = ["ASC", "DESC"];
