const TableData = ({el, data}) => {
  console.log(String(el[data]));
    return (
      <>
        <td>{el[data].toString()}</td>
      </>
    );
  };

  export default TableData;