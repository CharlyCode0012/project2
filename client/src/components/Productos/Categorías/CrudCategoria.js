import "../../../index.css";
import Modal from "../../Modal";
import React, { useContext } from "react";
import CrudContext from "../../../Context/CrudContext";
import Loader from "../../Loader";
import Message from "../../Message";
import Table from "../../Table/Table";
import FormCategory from "./FormCategory";

const validationSearch = (text, path, order, navigate) => {
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexState= /^\d{1}$/;

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
  const title = "Categorias";
  const { db, error, loading, dataToEdit, isOpenForm, closeModalForm, create } =
    useContext(CrudContext);

  let bgColors = {
    danger: "#dc3545",
    exit: "#28a745",
    info: "#17a2b8",
    warning: "#ffc107",
  };

  return (
    <div>
      {(dataToEdit || create) && isOpenForm && (
        <Modal isOpen={isOpenForm} closeModal={closeModalForm}>
          <FormCategory />
        </Modal>
      )}
      
      {loading && <Loader />}
      
      {db && (
        <Table
          th={th}
          keys={keys}
          title={title}
          validationSearch={validationSearch}
        />
      )}
      
      {error && (
        <Message
          msg={`Error ${error.status}: ${error.statusText}`}
          bgColor={bgColors.danger}
        />
      )}
    </div>
  );
};

export default CrudCategorias;
