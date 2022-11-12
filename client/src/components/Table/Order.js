import { useContext } from "react";
import CrudContext from "../../Context/CrudContext";

const Order = () => {
  const { setOrder } = useContext(CrudContext);

  return (
    <div className="navbar-brand">
      <select
        className="form-select form-select"
        aria-label=".form-select-sm example"
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="ASC">Ascendente</option>
        <option value="DESC">Descendente</option>
      </select>
    </div>
  );
};

export default Order;
