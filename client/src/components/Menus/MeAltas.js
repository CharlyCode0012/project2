import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { BsGear } from "react-icons/bs";
import "../../index.css";
import { Hover } from "../StyledComponents/Hover.js";
import Alta from "../../pages/Altas/Alta";
import Usuario from "../../pages/Altas/Usuario";

function Menu() {
  /* A placeholder for the background color. */

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Hover>
            <NavLink className="navbar-brand padding-l-1" to="/inicio">
              Inicio
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
                    to="usuario"
                  >
                    Usuarios
                  </NavLink>
                </Hover>
              </li>
              <li className="nav-item">
                <Hover>
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="alta"
                  >
                    Creacion de usuario
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
        <Route path="" element={<Navigate to="usuario" />} />
        <Route path=":topic/*" element={<ComponentP />} />
      </Routes>
    </>
  );
}

export default function MeAltas() {
  return (
    <div>
      <Menu />
    </div>
  );
}

const ComponentP = () => {
  let { topic } = useParams();
  let url = !topic ? "usuario" : topic;
  let componentP = url === "usuario" ? <Usuario /> : <Alta />;
  return componentP;
};
