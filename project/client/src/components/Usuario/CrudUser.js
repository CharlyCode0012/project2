import React, { useContext } from "react";

import "../../index.css";
import FormUs from "./FormUs";
import Table from "../Table/Table";
import Loader from "../Loader";
import Message from "../Message";
import Modal from "../Modal";
import CrudContext from "../../Context/CrudContext";

/* const formatCel = (text) => {
  let temp = text.replace(/[\s-]/g, "");

  let numbers = temp.substring(0,2);
  let restNumber = temp.substring(2);
  restNumber = restNumber.match(/.{1,4}/g);

  if(Array.isArray(restNumber))
    restNumber = restNumber.join("-");
  console.log(restNumber);
  
  if(restNumber != null) numbers = numbers + "-" + restNumber;
  console.log(numbers);

  return numbers;
  
} */

const validationSearch = (text, path, order, navigate) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  //let regexNum = /^[2-9]{2}-{1}[0-9]{4}-{1}[0-9]{4}$/;
  let regexNum=/^[\d-]+$/

  if (regexName.test(text)) {
    navigate({pathname: path + "/getUserByName/" + text, search: "?order=" + order});
    return {text: "name", url: "/getUserByName/?order=" + order}
  }

  if (regexNum.test(text)) {
    //text = formatCel(text);
    navigate({pathname: path + "/getUserByCel/" + text, search: "?order=" + order});
    return {text: "cel", url: "/getUserByCel/?order=" + order};
  }

  return {text:"", url:""};
};

function CrudApi({ th, keys }) {
  const {
    db,
    error,
    loading,
    dataToEdit,
    isOpenForm,
    closeModalForm,
    create,
  } = useContext(CrudContext);


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
          <FormUs/>
        </Modal>
      )}
      {loading && <Loader />}
      {db && (
        <Table
          th={th}
          keys={keys}
          title="Usuarios"
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
}

export default CrudApi;
