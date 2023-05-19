import React, { useState, ReactNode } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Order } from "./Order";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	useTheme,
} from "@mui/material";
import "./StyledSearchApp.css";

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

export type QueryOrder = "ASC" | "DESC";

interface SearchAppBarProps {
	searchOptions: string[];
	onSubmitSearch: (
		filter: string,
		search: string,
		order: QueryOrder
	) => Promise<void>;
}

export const SearchAppBar: React.FC<SearchAppBarProps> = ({
	searchOptions,
	onSubmitSearch,
}) => {
	const [order, setOrder] = useState<QueryOrder>("ASC");
	const [search, setSearch] = useState<string>("");
	const [filter, setFilter] = useState<string>("Todos");

	const theme = useTheme();

	function handleChangeOrder(
		event: SelectChangeEvent<string>,
		child: ReactNode
	): void {
		setOrder(event.target.value as QueryOrder);
	}

	function handleChangeSearch(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void {
		const { value } = e.target;
		setSearch(value);
	}

	return (
		<Box
			sx={{
				flexGrow: 0,
				marginTop: "40px",
				width: "800px",
			}}
			className="searchApp"
		>
			<AppBar position="static">
				<Toolbar sx={{ padding: "10px", gap: "10px" }}>
					<Order handleChangeOrder={handleChangeOrder} value={order} />

					<FormControl
						sx={{ marginLeft: "2opx", marginRight: "20px" }}
						color={theme.palette.mode === "dark" ? "secondary" : "warning"}
					>
						<InputLabel sx={{ color: "inherit" }}>Filtrar por</InputLabel>

						<Select
							defaultValue={"Todos"}
							label="Filtrar por"
							sx={{ width: "200px", color: "inherit" }}
							onChange={(e) => setFilter(e.target.value as string)}
						>
							<MenuItem value={"Todos"}>{"Todos"}</MenuItem>
							{searchOptions.map((option, index) => (
								<MenuItem key={index} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</FormControl>

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
						variant="contained"
						onClick={() => {
							onSubmitSearch(filter, search, order);
						}}
						color={theme.palette.mode === "dark" ? "secondary" : "warning"}
					>
						Buscar
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
