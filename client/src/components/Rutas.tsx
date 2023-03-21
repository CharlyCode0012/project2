import React from "react";

import Login from "pages/Login/Login";
import { Route, Routes } from "react-router-dom";
import Home from "pages/Home/Home";
import Categories from "pages/Categories/Categories";

const Rutas = () => {
	const num = 0;
	return (
		<>
			<Routes>
				<Route path="login" element={<Login />} />

				<Route path="/home/*" element={<Home />} />

				<Route path="productos">
					<Route index element={<>Productos</>} />
					<Route path="categorias" element={<Categories />} />
				</Route>
			</Routes>
		</>
	);
};

export default Rutas;
