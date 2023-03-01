import React from "react";
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
} from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Menu from "./pages/Menu/Menu";
import Categories from "pages/Categories/Categories";

const App: React.FC = () => {
	const avoidError = 0;

	return (
		<Router>
			<Switch>
				<Route index element={<Login />} />
				<Route path="login" element={<Login />} />

				<Route path="menu" element={<Menu />} />

				<Route path="productos">
					<Route index element={<>Productos</>} />
					<Route path="categorias" element={<Categories />} />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
