import React, { useContext } from "react";
import { BsFillPencilFill, BsFillXSquareFill } from "react-icons/bs";
import CrudContext from "../../Context/CrudContext";

export default function TableRow({ el, keys, index, admin, buttons }) {
  let { id } = el;
  const { findData, deleteData } = useContext(CrudContext);
  let style = keys.length <= 3 ? "w-25 me-5 text-center" : "text-center";

  return (
    <tr>
      <td>{index + 1}</td>
      {keys.map((data, index) => (
        <td className={style} key={id + index}>
          {el[data].toString()}
        </td>
      ))}
      {admin && (
        <td className={style}>
          <RenderButtons
            findData={findData}
            deleteData={deleteData}
            el={el}
            buttons={buttons}
          />
        </td>
      )}
    </tr>
  );
}

const Buttons = ({ findData, deleteData, el }) => {
  let { id, name } = el;
  return (
    <>
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
        onClick={() => deleteData(name, id)}
      >
        <BsFillXSquareFill />
      </button>
    </>
  );
};

const Answers = () => {
  return (
    <>
      <p>Hola</p>
    </>
  );
};

const RenderButtons = ({ buttons, findData, deleteData, el }) => {
  console.log("buttons", buttons);
  if (buttons)
    return <Buttons findData={findData} deleteData={deleteData} el={el} />;
  else return <Answers />;
};
