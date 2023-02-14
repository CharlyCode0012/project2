import React, { useContext } from "react";
import TableRow from "./TableRow";
import { useColumn } from "../../hooks/useColumn";
import { useRow } from "../../hooks/useRow";
import TableHeader from "./TableHeader";
import { BsPlusLg } from "react-icons/bs";
import CrudContext from "../../Context/CrudContext";
import "../Search.css";
import NavSearch from "./NavSearch";
import Cookies from "universal-cookie";

function Table({ th, keys, title, validationSearch, buttons = true  }) {
  const { db, handleCreate } = useContext(CrudContext);
  const columns = useColumn(th);
  const rows = useRow(db);
  const cookies = new Cookies();
  const user = cookies.get("user");
  let admin = false;
  if (user) admin = user.type_use === "admin" ? true : false;
  //console.log("Fila: ", rows, "columns: ", columns);

  return (
    <div className="container">
      <div className="row justify-content-center pe-2">
        <div className=" col-auto mt-5">
          <NavSearch title={title} validationSearch={validationSearch} />
          <br />
          <h1>{title}</h1>
          <table className="table-responsive table table-hover mx-auto d-block table-bordered">
            <thead className="table-dark">
              <TableHeader th={columns} admin={admin} />
            </thead>
            <tbody className="table-secondary">
              {!db.length > 0 ? (
                <tr>
                  <td colSpan={th.length + 2}>Sin datos</td>
                </tr>
              ) : (
                rows.map((el, index) => (
                  <TableRow
                    key={el.id}
                    el={el}
                    keys={keys}
                    index={index}
                    admin={admin}
                    buttons={buttons}
                  />
                ))
              )}
            </tbody>
          </table>
          {admin && (
            <div>
              <button
                onClick={handleCreate}
                className="btn btn-outline-info mb-3"
              >
                <BsPlusLg />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
