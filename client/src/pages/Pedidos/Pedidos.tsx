import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pedidos = () => {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("/pedidos/confirmar-pedido");
	}, []);
	return <></>;
};

export default Pedidos;
