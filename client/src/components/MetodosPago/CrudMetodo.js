import "../../index.css";
import Modal from "../Modal";
import React, { useContext } from "react";
import CrudContext from "../../Context/CrudContext";
import Loader from "../Loader";
import Message from "../Message";
import Table from "../Table/Table";
import FormMetodo from "./FormMetodo";

const validationSearch = (text, path, order, navigate) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9]+$/;
  let regexCard = /^\d{4}\s{1}\d{4}\s{1}\d{4}\s{1}\d{4}$/;

  if (regexCard.test(text)) {
    navigate({
      pathname: path + "/getMethodByCard/" + text,
      search: "?order=" + order,
    });
    return { text: "card", url: "/getMethodByCard/?order=" + order };
  }

  if (regexName.test(text)) {
    navigate({
      pathname: path + "/getMethodByName/" + text,
      search: "?order=" + order,
    });
    return { text: "name", url: "/getMethodByName/?order=" + order };
  }

  return { text: "", url: "" };
};

const CrudMetodo = ({ th, keys }) => {
  const title = "Metodos de pago";
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
          <FormMetodo />
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

export default CrudMetodo;
