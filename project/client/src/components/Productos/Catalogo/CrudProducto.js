import "../../../index.css";
import Modal from "../../Modal";
import React, { useContext, useState, useEffect } from "react";
import CrudContext from "../../../Context/CrudContext";
import Loader from "../../Loader";
import Message from "../../Message";
import Table from "../../Table/Table";
import FormProduct from "./FormProduct";
import { helpHTTP } from "../../../helper/helpHTTP";

const validationSearch = (text, path, order, navigate) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexState = /^\d{1}$/;

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

const CrudProducto = ({ th, keys }) => {
  const bgColors = {
    danger: "#dc3545",
    exit: "#28a745",
    info: "#17a2b8",
    warning: "#ffc107",
  };

  const title = "Producto";
  const {
    db,
    error,
    loading,
    dataToEdit,
    isOpenForm,
    closeModalForm,
    create,
    url,
  } = useContext(CrudContext);
  const [catalog, setCatalog] = useState("");

  const handleChangeCatalog = (e) => {
    const { value } = e.target;
    const id = value;
    setCatalog(id);
  };

  useEffect(() => {
    let api = helpHTTP();
    let Url = url + "?idCatalog=" + catalog;
    api.get(Url);
  }, [catalog]);

  return (
    <div>
      {(dataToEdit || create) && isOpenForm && (
        <Modal isOpen={isOpenForm} closeModal={closeModalForm}>
          <FormProduct />
        </Modal>
      )}
      <div className=" col-auto mt-5">
        <br />
      </div>
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

export default CrudProducto;
