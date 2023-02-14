import React from 'react'
import CrudDuda from '../../components/Productos/Dudas/CrudDuda.js';
import { CrudProvider } from "../../Context/CrudContext";
const keys = ["name", "description","state"];
const th = ["Nombre", "Descripcion" ,"Estado"]; 
//const url = "https://server-production-4487.up.railway.app/api/catalogs; //prod
const url = "http://localhost:3200/api/catalogs"; //dev-back
//const url = "http://localhost:5000/usuarios"; //dev-false-back

const Duda = () => {
  return (
    <>
      <CrudProvider url={url} path="/producto/catalogo">
        <CrudDuda th={th} keys={keys} buttons={false}/>
      </CrudProvider>
    </>
  );
};

export default Duda