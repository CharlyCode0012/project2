import React from "react";

import Login from "pages/Login/Login";
import { Route, Routes } from "react-router-dom";
import Home from "pages/Home/Home";
import Categorias from "pages/Productos/Categories/Categorias";
import Productos from "pages/Productos/Productos";
import Usuarios from "pages/Usuarios/Usuarios";
import Pedidos from "pages/Pedidos/Pedidos";
import Analisis from "pages/Analisis/Analisis";
import LugaresEntrega from "pages/LuagresEntrega/LuagresEntrega";
import MetodosPago from "pages/MetodosPago/MetodosPago";
import Perfil from "pages/Perfil/Perfil";
import Catalogos from "pages/Productos/Catalogos/Catalogos";

const Rutas = () => {
	const num = 0;
	return (
		<>
			<Routes>
				<Route index path="login" element={<Login />} />

				<Route path="/analisis/*" element={<Analisis />} />

				<Route path="configuracion/*" element={<Perfil />} />

				<Route path="/inicio/*" element={<Home />} />

				<Route path="lugares-de-entrega/*" element={<LugaresEntrega />} />

				<Route path="metodos-de-pago/*" element={<MetodosPago />} />

				<Route path="pedidos/*" element={<Pedidos />} />

				<Route path="perfil/*" element={<Perfil />} />

				<Route path="productos">
					<Route index element={<Productos />} />
					<Route path="categorias" element={<Categorias />} />
					<Route path="catalogos" element={<Catalogos />} />
				</Route>

				<Route path="usuarios/*" element={<Usuarios />} />
			</Routes>
		</>
	);
};

export default Rutas;
