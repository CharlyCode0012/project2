import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import Rutas from "@/Rutas";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LoginProvider } from "context/LoginContext";

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
				<LoginProvider>
					<Rutas />
				</LoginProvider>
			</Router>
		</ThemeProvider>
	);
};

export default App;
