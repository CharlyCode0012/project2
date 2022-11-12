import React from "react";

const TableHeader = ({ th, admin }) => {
  let key = Date.now();
  return (
    <>
      <tr>
        {th.map((topic, index) => (
          <th key={key + index}>{topic}</th>
        ))}
        {admin && <th>Acciones</th>}
      </tr>
    </>
  );
};

export default TableHeader;
