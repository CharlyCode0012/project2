import React from "react";
import Login from "../../components/InicioSesion/Login";
import { CrudProvider } from "../../Context/CrudContext";


//const url = "https://server-production-4487.up.railway.app/api/users"; //prod
const url = "http://localhost:3200/api/users/login"; //dev-back
//const url = "http://localhost:5000/usuarios"; //dev-false-back
const path = "";

const InicioSesion = () => {

  return (
    <CrudProvider url={url} path={path} flag={false}>
      <Login />
    </CrudProvider>
  );
};

export default InicioSesion;
