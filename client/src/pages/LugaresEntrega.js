import React, { useEffect } from 'react'
import NavBar from '../components/Menus/NavBar'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom';

const LugaresEntrega = () => {
  return (
    <div>
      <NavBar />
        <h2>Lugares de Entrega</h2>
    </div>
  )
}

export default LugaresEntrega