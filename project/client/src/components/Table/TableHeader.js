import React from "react";

const TableHeader = ({ th, admin }) => {
  let key = Date.now();
  let style = th.length <= 3 ? "w-25 me-4 text-center" : "text-center";

  return (
    <>
      <tr>
        <th>#</th>
        {th.map((topic, index) => (
          <th className={style} key={key + index}>
            {topic}
          </th>
        ))}
        {admin && <th className={style}>Acciones</th>}
      </tr>
    </>
  );
};

export default TableHeader;
