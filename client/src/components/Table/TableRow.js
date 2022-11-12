import React, { useContext } from "react";
import { BsFillPencilFill, BsFillXSquareFill } from "react-icons/bs";
import CrudContext from "../../Context/CrudContext";
import CryptoJs from "crypto-js";

const generateHash = (id) => {
  return CryptoJs.AES.encrypt(id, "webos").toString();
};

export default function TableRow({ el, keys, index, admin }) {
 
  let { id } = el;
  const { findData, deleteData } = useContext(CrudContext);
  return (
    <tr>
      <td>{index + 1}</td>
      {keys.map((data, index) => (
        <td key={el.id + index}>{el[data]}</td>
      ))}
      {admin && (
        <td>
          <button
            className="btn btn-primary m-1"
            onClick={() => {
              findData(id);
            }}
          >
            <BsFillPencilFill />
          </button>
          <button
            className="btn btn-danger pb-2"
            onClick={() => deleteData(el.name, id)}
          >
            <BsFillXSquareFill />
          </button>
        </td>
      )}
    </tr>
  );
}
