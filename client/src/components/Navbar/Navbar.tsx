import React from "react";
import { AppBar, Box, Toolbar } from "@mui/material";

const Navbar = () => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar></Toolbar>
			</AppBar>
		</Box>
	);
};

export default Navbar;
