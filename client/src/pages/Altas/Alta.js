import React from "react";
import CrudUser from "../../components/Usuario/CrudUser";
import NavBar from "../../components/Menus/NavBar";
import { CrudProvider } from "../../Context/CrudContext";
const keys = ["name", "date_B", "type_use", "cel"];
const th = ["#","Nombre", "Fecha Nacimiento", "Usuario","Cel."];
//const url = "https://server-production-4487.up.railway.app/api/users"; //prod
const url = "http://localhost:3200/api/users"; //dev-back
//const url = "http://localhost:5000/usuarios"; //dev-false-back

const Alta = () => {
  return (
    <>
      <NavBar />
      <CrudProvider url={url} path="/usuarios">
        <CrudUser th={th} keys={keys}/>
      </CrudProvider>
    </>
  );
};

export default Alta;
