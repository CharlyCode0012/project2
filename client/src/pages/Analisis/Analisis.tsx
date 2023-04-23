import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Analisis = () => {
	const navigate = useNavigate();
	useEffect(() => {
		navigate("/analisis/analisis-productos");
	}, []);
	return <></>;
};

export default Analisis;
