import React, { useEffect } from "react";
import Navbar from "@/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Analisis = () => {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("analisis/analisis-productos", { replace: true });
	}, []);

	return <></>;
};

export default Analisis;
