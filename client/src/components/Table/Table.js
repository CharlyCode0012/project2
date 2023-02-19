import React from "react";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import "../Search.css";

const Table = ({ title, headers, dataProperties, data }) => {
  
  /**
   * Contains whether the given data is empty, if so, table
   * displays it to the user
   */
  const dataIsEmpty = (data === undefined) || (data === null) || (data.length === 0)

  return (
    <div className="container">
      <div className="row justify-content-center pe-2">
        <div className=" col-auto mt-5">
          <h1>{ title }</h1>
          
          <table className="table-responsive table table-hover mx-auto d-block table-bordered">
            <thead className="table-dark">
              <TableHeader headers={ headers } isAdmin={ true } />
            </thead>
            
            <tbody className="table-secondary">
              {
                dataIsEmpty
                ? <tr><td colSpan={ dataProperties.length }>Sin datos</td></tr>

                : data.map((category, index) => 
                    <TableRow
                      category={ category }
                      isAdmin={ true }
                      dataProperties={ dataProperties }
                      key={ index } />
                  )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
