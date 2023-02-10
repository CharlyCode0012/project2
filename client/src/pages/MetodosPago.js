import React from 'react'
import NavBar from '../components/Menus/NavBar'
import CrudMetodo from '../components/MetodosPago/CrudMetodo';
import { CrudProvider } from '../Context/CrudContext';
const keys = ["name", "CLABE", "no_card", "bank", "subsidary"];
const th = ["Nombre", "Clabe", "No. Tarjeta","Banco", "Subsidarias"];
//const url = "https://server-production-4487.up.railway.app/api/payment_methods"; //prod
const url = "http://localhost:3200/api/payment_methods"; //dev-back
//const url = "http://localhost:5000/payment_methods"; //dev-false-back

const MetodosPago = () => {
  return (
    <>
    <NavBar />
    <CrudProvider url={url} path="/metodo-de-pago">
      <CrudMetodo th={th} keys={keys}/>
    </CrudProvider>
  </>
  )
}

export default MetodosPago