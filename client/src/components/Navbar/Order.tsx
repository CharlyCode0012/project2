import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface PropsOrder {
	value: string | null;
	handleChangeOrder: (option: string | null) => void;
}

export const Order: React.FC<PropsOrder> = ({ handleChangeOrder, value }) => {
	const num = 0;
	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={Options}
			value={value}
			sx={{ width: 150, marginRight: 2 }}
			onChange={(
				event: React.SyntheticEvent<Element, Event>,
				newValue: string | null
			) => {
				handleChangeOrder(newValue);
			}}
			renderInput={(params) => <TextField {...params} label="Orden" />}
		/>
	);
};

const Options = ["ASC", "DESC"];
