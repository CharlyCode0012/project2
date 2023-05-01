import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { BsGear, BsHouse } from "react-icons/bs";
import "../../index.css";
import { Hover } from "../StyledComponents/Hover.js";
import AnalisisProductos from "../../pages/Analisis/AnalisisProductos";
import AnalisisClientes from "../../pages/Analisis/AnalisisClientes";

function Menu() {
  /* A placeholder for the background color. */

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Hover>
            <NavLink className="navbar-brand padding-l-1" to="/inicio">
            <BsHouse className="mt-1 mb-1" style={{ color: "#eee", fontSize: "2rem" }}/>
            </NavLink>
          </Hover>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Hover>
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="analisis-producto"
                  >
                    Informe de Productos
                  </NavLink>
                </Hover>
              </li>
              <li className="nav-item">
                <Hover>
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="analisis-cliente"
                  >
                    Informe de Clientes
                  </NavLink>
                </Hover>
              </li>
            </ul>
            <Hover>
              <div className="d-flex padding-t-l-b-05">
                <NavLink
                  className="sticky-lg-bottom me-2"
                  aria-current="page"
                  to="/config"
                >
                  {/*GrServices */}
                  <BsGear style={{ color: "#eee", fontSize: "2rem" }} />
                </NavLink>
              </div>
            </Hover>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="" element={<Navigate to="analisis-producto" />} />
        <Route path=":topic" element={<ComponentP />} />
      </Routes>
    </>
  );
}

export default function MeAnalisis() {
  return (
    <div>
      <Menu />
    </div>
  );
}

const ComponentP = () => {
  let { topic } = useParams();
  let url = !topic ? "analisis-producto" : topic;
  let componentP = url === "analisis-producto" ? <AnalisisProductos /> : <AnalisisClientes />;
  return componentP;
};
