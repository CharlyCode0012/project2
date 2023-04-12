import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Order } from "./Order";
import { Button } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

interface SearchAppBarProps {
	onSubmitSearch: (search: string, order: string) => Promise<void>;
}

export const SearchAppBar: React.FC<SearchAppBarProps> = ({ onSubmitSearch, }) => {
	const [order, setOrder] = useState<string>("ASC");
	const [search, setSearch] = useState<string>("");
	function handleChangeOrder(value: string | null): void {
		value = value ?? "ASC";
		setOrder(value);
	}

	function handleChangeSearch(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void {
		const { value } = e.target;
		setSearch(value);
	}

	return (
		<Box sx={{ flexGrow: 0, marginTop: "120px", width: "800px" }}>
			<AppBar position="static">
				<Toolbar sx={{ padding: "10px" }}>
					<Order handleChangeOrder={handleChangeOrder} value={order} />
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							name="search"
							value={search}
							onChange={handleChangeSearch}
							placeholder="Search…"
							inputProps={{ "aria-label": "search" }}
						/>
					</Search>
					<Button
						variant="outlined"
						sx={{ marginLeft: 15 }}
						onClick={() => {
							onSubmitSearch(search, order);
						}}
					>
						Buscar
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
