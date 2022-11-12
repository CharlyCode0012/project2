import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export const Config = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const handleLogOut = (e) => {
    cookies.remove("user");
    navigate("/iniciar-sesion", { replace: true });
  };

  return (
    <>
      <button className="btn btn-danger" onClick={handleLogOut}>
        Cerrar Sesion
      </button>
    </>
  );
};
