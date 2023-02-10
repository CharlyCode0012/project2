import React from 'react'
import CrudCategoria from "../../components/Productos/Categorías/CrudCategoria";
import { CrudProvider } from "../../Context/CrudContext";
const keys = ["name", "state"];
const th = ["Nombre", "Estado"]; 
//const url = "https://server-production-4487.up.railway.app/api/categories; //prod
const url = "http://localhost:3200/api/categories"; //dev-back
//const url = "http://localhost:5000/usuarios"; //dev-false-back

const Categoria = () => {
  return (
    <>
      <CrudProvider url={url} path="/producto/categoria">
        <CrudCategoria th={th} keys={keys}/>
      </CrudProvider>
    </>
  );
};

export default Categoria;