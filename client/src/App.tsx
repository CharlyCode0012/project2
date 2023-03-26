import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import Rutas from "@/Rutas";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const App: React.FC = () => {
	const avoidError = 0;

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Router>
				<Rutas />
			</Router>
		</ThemeProvider>
	);
};

export default App;
