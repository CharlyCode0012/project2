import "../../../index.css";
import Modal from "../../Modal";
import React, { useContext, useEffect } from "react";
import CrudContext from "../../../Context/CrudContext";
import Loader from "../../Loader";
import Message from "../../Message";
import Table from "../../Table/Table";
import FormCategory from "./FormCategory";
import useFetch from "../../../hooks/useFetch";
import useLogger from "../../../hooks/useLogger";

const validationSearch = (text, path, order, navigate) => {
  const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  const regexState= /^\d{1}$/;

  if (regexState.test(text)) {
    navigate({
      pathname: path + "/getCategoryByState/" + text,
      search: "?order=" + order,
    });
    return { text: "state", url: "/getCategoryByState/?order=" + order };
  }

  if (regexName.test(text)) {
    navigate({
      pathname: path + "/getCategoryByName/" + text,
      search: "?order=" + order,
    });
    return { text: "name", url: "/getCategoryByName/?order=" + order };
  }

  return { text: "", url: "" };
};

const CrudCategorias = ({ th, keys }) => {
  // const title = "Categorias";
  // const { db, error, loading, dataToEdit, isOpenForm, closeModalForm, create } =
    // useContext(CrudContext);

  // let bgColors = {
  //   danger: "#dc3545",
  //   exit: "#28a745",
  //   info: "#17a2b8",
  //   warning: "#ffc107",
  // };

  const [ categories, error, isFetchingCategories, api ] = useFetch();
  // useLogger(categories, "== Fetched Categories =="); // TODO: Remove logger

  useEffect(() => {
    api.get("/categories")
  }, [ api ])

  return (
    <div>
      {/* {(dataToEdit || create) && isOpenForm && (
        <Modal isOpen={isOpenForm} closeModal={closeModalForm}>
          <FormCategory />
        </Modal>
      )} */}
      
      { isFetchingCategories && <Loader />}
      
      {
        !isFetchingCategories &&
        <Table
          title={ "Categorias" }
          headers={[ "ID", "Nombre", "Estado" ]}
          dataProperties={[ "id", "name", "state" ]}
          data={ categories } />
      }
      
      {/* {error && (
        <Message
          msg={`Error ${error.status}: ${error.statusText}`}
          bgColor={bgColors.danger}
        />
      )} */}
    </div>
  );
};

export default CrudCategorias;
