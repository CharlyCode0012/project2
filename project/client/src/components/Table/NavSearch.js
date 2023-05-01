import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudContext from "../../Context/CrudContext";
import Message from "../Message";
import { bgColors } from "../colors";
import Order from "./Order";

const NavSearch = ({ title, validationSearch, search }) => {
  const navigate = useNavigate();

  const { handleSearch, setNavSearch, navSearch } = useContext(CrudContext);
  const [errors, setErrors] = useState(null);
  return (
    <>
    {errors && (
        <Message
          msg="Solo se puede buscar un Nombre sin números o un No. celular en formato: XX-XXXX-XXXX"
          bgColor={bgColors.info}
          height="6rem"
        />
      )}
      <div className="navbar">
        <div className="container-fluid">
          <Order />
          <div className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder={`Filtrar ${title}`}
              value={navSearch}
              onChange={(e) => {
                setNavSearch(e.target.value);
              }}
            />
            <button
              className="btn btn-outline-success"
              onClick={(e) => {
                handleSearch(validationSearch, setErrors, errors, navigate);
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavSearch;
