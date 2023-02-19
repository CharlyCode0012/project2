import React from "react";
import { BsFillPencilFill, BsFillXSquareFill } from "react-icons/bs";

const TableRow = ({ category, dataProperties, isAdmin }) => {
  
  return (
    <tr>
      {
        dataProperties.map((key, index) =>
          <td className={ "w-25 me-5 text-center" } key={ index }>
            { category[key].toString() }
          </td>
        )
      }
      {
        isAdmin && 
        <td className={ "w-25 me-5 text-center" }>
          <button className="btn btn-primary m-1">
            <BsFillPencilFill />
          </button>

          <button className="btn btn-danger pb-2">
            <BsFillXSquareFill />
          </button>
        </td>
      }
    </tr>
  );
}

export default TableRow;