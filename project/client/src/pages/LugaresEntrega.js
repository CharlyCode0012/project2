import React from "react";
import NavBar from "../components/Menus/NavBar";
import CrudLugares from "../components/LuagresEntrega/CrudLugares";
import { CrudProvider } from "../Context/CrudContext";

const keys = ["name", "cp", "open_h", "close_h"];
const th = ["Nombre", "Código Postal", "Hora abierto", "Hora cierre"];
const url = "http://localhost:3200/api/places";
const path = "/lugar-de-entrega";

const LugaresEntrega = () => {
  return (
    <>
      <NavBar />
      <CrudProvider url={url} path={path}>
        <CrudLugares th={th} keys={keys} />
      </CrudProvider>
    </>
  );
};

export default LugaresEntrega;
