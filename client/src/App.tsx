import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import Rutas from "@/Rutas";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LoginProvider } from "context/LoginContext";
import { SnackbarProvider } from "notistack";
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const App: React.FC = () => {
	const [mode, setMode] = React.useState<"light" | "dark">("light");
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[]
	);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SnackbarProvider maxSnack={3}>
					<Router>
						<LoginProvider>
							<Rutas />
						</LoginProvider>
					</Router>
				</SnackbarProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default App;
