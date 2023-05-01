import "../../../index.css";
import Modal from "../../Modal";
import React, { useContext } from "react";
import CrudContext from "../../../Context/CrudContext";
import Loader from "../../Loader";
import Message from "../../Message";
import Table from "../../Table/Table";
import FormCatalog from "./FormCatalog";

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
      pathname: path + "/getCatalogByName/" + text,
      search: "?order=" + order,
    });
    return { text: "name", url: "/getCatalogByName/?order=" + order };
  }

  return { text: "", url: "" };
};

const CrudCatalog = ({ th, keys }) => {
  const title = "Catalogo";
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
          <FormCatalog />
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

export default CrudCatalog;
