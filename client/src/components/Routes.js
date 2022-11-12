import { Navigate, Route, Routes } from "react-router-dom";
import Analisis from "../pages/Analisis/Analisis";
import Configuracion from "../pages/Configuracion";
import Inicio from "../pages/Inicio";
import InicioSesion from "../pages/InicioSesion/InicioSesion";
import LugaresEntrega from "../pages/LugaresEntrega";
import Menu from "../pages/Menu";
import MetodosPago from "../pages/MetodosPago";
import Pedidos from "../pages/Pedidos/Pedidos";
import Perfil from "../pages/Perfil";
import Productos from "../pages/Productos/Producto";
import Alta from "../pages/Altas/Alta";
import Error404 from "../pages/Error404";

const Rutas = ({ setUrl }) => {
  return (
    <>
      <Routes>
        <Route path="/analisis/*" element={<Analisis setUrl={setUrl} />} />
        <Route path="/usuarios/*" element={<Alta />} />
        <Route path="/config/*" element={<Configuracion />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/iniciar-sesion" element={<InicioSesion />} />
        <Route path="/lugar-de-entrega/*" element={<LugaresEntrega />} />
        <Route path="/menu/*" element={<Menu />} />
        <Route path="/metodo-de-pago/*" element={<MetodosPago />} />
        <Route path="/pedido/*" element={<Pedidos />} />
        <Route path="/perfil/*" element={<Perfil />} />
        <Route path="/producto/*" element={<Productos />} />
        <Route path="/" element={<Inicio />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Rutas;
