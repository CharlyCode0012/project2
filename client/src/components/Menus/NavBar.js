import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { BsGear, BsHouse } from "react-icons/bs";
import "../../index.css";
import { Hover } from "../StyledComponents/Hover.js";
import Cookies from "universal-cookie";

function Menu() {
  /* A placeholder for the background color. */

  const cookies = new Cookies();
  const user = cookies.get("user");
  let admin = false;
  if (user) admin = user.type_use === "admin" ? true : false;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Hover>
          <NavLink className="navbar-brand padding-l-1" to="/inicio">
            <BsHouse
              className="mt-1 mb-1"
              style={{ color: "#eee", fontSize: "2rem" }}
            />
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
                  to="/perfil"
                >
                  Perfil
                </NavLink>
              </Hover>
            </li>
            <li className="nav-item">
              <Hover>
                <NavLink
                  className="nav-link active"
                  aria-current="page"
                  to="/lugar-de-entrega"
                >
                  Lugares de Entrega
                </NavLink>
              </Hover>
            </li>
            <li className="nav-item ">
              <Hover>
                <NavLink
                  className="nav-link active"
                  aria-current="page"
                  to="/metodo-de-pago"
                >
                  Metodos de Pago
                </NavLink>
              </Hover>
            </li>
            <Hover>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#action4"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Otros
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      aria-current="page"
                      to="/analisis"
                    >
                      Analisis
                    </NavLink>
                  </li>
                  {admin && (
                    <li>
                      <NavLink
                        className="dropdown-item"
                        aria-current="page"
                        to="/usuarios"
                      >
                        Usuarios
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      aria-current="page"
                      to="/pedido"
                    >
                      Pedidos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      aria-current="page"
                      to="/producto"
                    >
                      Productos
                    </NavLink>
                  </li>
                </ul>
              </li>
            </Hover>
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
  );
}

export default function NavBar() {
  return (
    <div>
      <Menu />
    </div>
  );
}
