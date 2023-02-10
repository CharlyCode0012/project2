import React from 'react';
import NavBar from '../components/Menus/NavBar';
import PerfilUs from '../components/Perfil/PerfilUs';
import { CrudProvider } from '../Context/CrudContext';
//const url = "https://server-production-4487.up.railway.app/api/users"; //prod
const url = "http://localhost:3200/api/users"; //dev-back

const Perfil = () => {
  
  return (
    <div>
      <NavBar /> 
      <CrudProvider url={url} path="/perfil" flag={false}>
        <PerfilUs />
      </CrudProvider>
    </div>
  )
}

export default Perfil