import React from "react";

const TableHeader = ({ headers, isAdmin }) => {
  const style = headers.length <= 3 ? "w-25 me-4 text-center" : "text-center";

  return (
    <>
      <tr>
        { 
          headers.map((header, index) =>
            <th className={ style } key={ index }> 
              { header } 
            </th>
          )
        }

        { isAdmin && <th className={style}>Acciones</th> }
      </tr>
    </>
  );
};

export default TableHeader;
