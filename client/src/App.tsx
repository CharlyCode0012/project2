import React from "react";
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
} from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

const App: React.FC = () => {
	const avoidError = 0;

	return (
		<Router>
			<Switch>
				<Route path="/login" element={<Login />} />
				<Route path="/home" element={<Home />} />
			</Switch>
		</Router>
	);
};

export default App;
