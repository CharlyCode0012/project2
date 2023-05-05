import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import Rutas from "@/Rutas";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LoginProvider } from "context/LoginContext";
import { SnackbarProvider } from "notistack";
import Cookies from "universal-cookie";
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

type themes = "light" | "dark";

const cookie = new Cookies();

const App: React.FC = () => {
	const stringMode: themes = cookie.get("theme");
	const [mode, setMode] = React.useState<themes>(stringMode ?? "dark");

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					secondary: {
						main: "#009688",
					},
				},
			}),
		[mode]
	);

	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[]
	);

	useEffect(() => {
		cookie.set("theme", "dark", {
			path: "/",
		});
		console.log(cookie.get("theme"));
	}, []);

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
export { ColorModeContext };
