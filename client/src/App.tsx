import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import "./App.css";

import Rutas from "@/Rutas";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LoginProvider } from "context/LoginContext";
import { SnackbarProvider } from "notistack";
import Cookies from "universal-cookie";
import { themes, ThemeName, Mode } from "./themes/themes";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
const ThemeContext = React.createContext({
	setThemeName: (themeName: ThemeName) => {},
});

const cookie = new Cookies();

const App: React.FC = () => {
	const [themeName, setThemeName] = useState<ThemeName>(
		cookie.get("themeName") || "green"
	);
	const [mode, setMode] = useState<Mode>(cookie.get("mode") || "light");

	const theme = createTheme({
		palette: themes[themeName][mode],
	});

	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				const newMode = mode === "light" ? "dark" : "light";
				cookie.set("mode", newMode, { path: "/" });
				setMode(newMode);
			},
		}),
		[mode]
	);

	useEffect(() => {
		cookie.set("themeName", themeName, { path: "/" });
		cookie.set("mode", mode, { path: "/" });
	}, [themeName, mode]);

	return (
		<ThemeContext.Provider value={{ setThemeName }}>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<SnackbarProvider maxSnack={3}>
						<HashRouter>
							<LoginProvider>
								<Rutas />
							</LoginProvider>
						</HashRouter>
					</SnackbarProvider>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</ThemeContext.Provider>
	);
};

export default App;
export { ColorModeContext, ThemeContext };
