import React from 'react'
import CrudProducto from '../../components/Productos/Catalogo/CrudProducto';
import { CrudProvider } from "../../Context/CrudContext";
const keys = ["name", "key_word","price", "stock", "category"];
const th = ["Nombre", "Palabra Clave","Precio" ,"No. Existencia", "Categoria"]; 
//const url = "https://server-production-4487.up.railway.app/api/products; //prod
const url = "http://localhost:3200/api/products"; //dev-back
//const url = "http://localhost:5000/usuarios"; //dev-false-back
const Productos = () => {
  return (
    <>
    <CrudProvider url={url} path="/producto/productos">
      <CrudProducto th={th} keys={keys}/>
    </CrudProvider>
  </>
  )
}

export default Productos