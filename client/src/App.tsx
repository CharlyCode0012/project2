import React from "react";
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
} from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Categorias from "pages/Productos/Categories/Categorias";
import Productos from "pages/Productos/Productos";
import Rutas from "@/Rutas";

const App: React.FC = () => {
	const avoidError = 0;

	return (
		<Router>
			<Rutas />
		</Router>
	);
};

export default App;
