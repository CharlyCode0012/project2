import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { BsGear, BsHouse } from "react-icons/bs";
import Duda from "../../pages/Productos/Duda";
import Categoria from "../../pages/Productos/Categoria";
import Catalogo from "../../pages/Productos/Catalogo";
import "../../index.css";
import { Hover } from "../StyledComponents/Hover.js";

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
                    to="catalogo"
                  >
                    Catalogo
                  </NavLink>
                </Hover>
              </li>
              <li className="nav-item">
                <Hover>
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="categoria"
                  >
                    Categorias
                  </NavLink>
                </Hover>
              </li>
              <li className="nav-item">
                <Hover>
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="duda"
                  >
                    Dudas
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
        <Route path="" element={<Navigate to="catalogo" />} />
        <Route path="catalogo/*" element={<Catalogo />} />
        <Route path="categoria/*" element={<Categoria />} />
        <Route path="duda" element={<Duda />} />
      </Routes>
    </>
  );
}

export default function MeProductos() {
  return (
    <div>
      <Menu />
    </div>
  );
}
