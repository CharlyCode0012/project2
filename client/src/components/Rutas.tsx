import React from "react";

import Login from "pages/Login/Login";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "pages/Home/Home";
import Categorias from "pages/Productos/Categorias/Categorias";
import Productos from "pages/Productos/Productos";
import Usuarios from "pages/Usuarios/Usuarios";
import Pedidos from "pages/Pedidos/Pedidos";
import Analisis from "pages/Analisis/Analisis";
import LugaresEntrega from "pages/LugaresEntrega/LugaresEntrega";
import MetodosPago from "pages/MetodosPago/MetodosPago";
import Perfil from "pages/Perfil/Perfil";
import Catalogos from "pages/Productos/Catalogos/Catalogos";
import Configuracion from "pages/Configuracion/Configuracion";
import Entregas from "pages/Pedidos/Entregas/Entregas";
import ConfirmarPedido from "pages/Pedidos/ConfirmarPedido/ConfirmarPedido";
import AnalisisProductos from "pages/Analisis/AnalisisProductos/AnalisisProductos";
import AnalisisClientes from "pages/Analisis/AnalisisClientes/AnalisisClientes";
import ComprasCliente from "pages/Analisis/AnalisisClientes/ComprasCliente";
import Dudas from "pages/Productos/Dudas/Dudas";
import ProductImage from "pages/Productos/ProductImage";
import MenuOptions from "pages/Menu/MenuOptions";

const Rutas = () => (
	<>
		<Routes>
			<Route index path="/" element={<Login />} />
			<Route path="login" element={<Login />} />

			<Route path="análisis">
				<Route index element={<Analisis />} />;
				<Route path="análisis-productos/*" element={<AnalisisProductos />} />
				<Route path="análisis-clientes/" element={<AnalisisClientes />} />
				<Route path="cliente/:clientId" element={<ComprasCliente />} />;
			</Route>

			<Route path="configuración/*" element={<Configuracion />} />
			<Route path="inicio/*" element={<Home />} />
			<Route path="menu/:menuTitle/:menuID" element={<MenuOptions />} />

			<Route path="lugares-de-entrega/*" element={<LugaresEntrega />} />
			<Route path="métodos-de-pago/*" element={<MetodosPago />} />

			<Route path="pedidos">
				<Route index element={<Pedidos />} />;
				<Route path="entregas/*" element={<Entregas />} />
				<Route path="confirmar-pedido/*" element={<ConfirmarPedido />} />
			</Route>

			<Route path="perfil/*" element={<Perfil />} />

			<Route path="productos">
				<Route index element={<Productos />} />
				<Route path="imagen/*" element={<ProductImage />} />
				<Route path="categorías/*" element={<Categorias />} />
				<Route path="catálogos/*" element={<Catalogos />} />
				<Route path="dudas/*" element={<Dudas />} />;
			</Route>

			<Route path="usuarios/*" element={<Usuarios />} />
		</Routes>
	</>
);

export default Rutas;
