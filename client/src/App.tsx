import React from "react";
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
} from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Categories from "pages/Categories/Categories";

const App: React.FC = () => {
	const avoidError = 0;

	return (
		<Router>
			<Switch>
				<Route index element={<Login />} />
				<Route path="login" element={<Login />} />

				<Route path="home" element={<Home />} />

				<Route path="products">
					<Route index element={<>Products</>} />
					<Route path="categories" element={<Categories />} />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
