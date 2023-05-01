import React from 'react'
import CrudCatalog from '../../components/Productos/Catalogo/CrudCatalog';
import { CrudProvider } from "../../Context/CrudContext";
const keys = ["name", "description","state"];
const th = ["Nombre", "Descripcion" ,"Estado"]; 
//const url = "https://server-production-4487.up.railway.app/api/catalogs; //prod
const url = "http://localhost:3200/api/catalogs"; //dev-back
//const url = "http://localhost:5000/usuarios"; //dev-false-back

const Catalogo = () => {
  return (
    <>
      <CrudProvider url={url} path="/producto/catalogo">
        <CrudCatalog th={th} keys={keys}/>
      </CrudProvider>
    </>
  );
};

export default Catalogo;