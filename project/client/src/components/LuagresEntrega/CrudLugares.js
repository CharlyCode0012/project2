import "../../index.css";
import Modal from "../Modal";
import React, { useContext } from "react";
import CrudContext from "../../Context/CrudContext";
import Loader from "../Loader";
import Message from "../Message";
import Table from "../Table/Table";
import FormLugar from "./FormLugar";

const validationSearch = (text, path, order, navigate) => {
  let regexAddress = /^.{1,200}$/;
  let regexCP = /^\d{5}$/;

  if (regexCP.test(text)) {
    navigate({
      pathname: path + "/getPlaceByCP/" + text,
      search: "?order=" + order,
    });
    return { text: "cp", url: "/getPlaceByCP/?order=" + order };
  }

  if (regexAddress.test(text)) {
    navigate({
      pathname: path + "/getPlaceByAddress/" + text,
      search: "?order=" + order,
    });
    return { text: "address", url: "/getPlaceByAddress/?order=" + order };
  }

  return { text: "", url: "" };
};

const CrudLugares = ({ th, keys }) => {
  const title = "Lugar Entrega";
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
          <FormLugar />
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

export default CrudLugares;
