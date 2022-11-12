import "./Modal.css";
import { BsXCircle } from "react-icons/bs";
const Modal = ({ children, isOpen, closeModal }) => {
  return (
    <article className={`modal ${isOpen && "is-open"}`}>
      <div className="modal-container">
        <button
          className="btn-radius btn btn-secondary"
          onClick={() => {
            closeModal();
          }}
        >
          <BsXCircle style={{ fontSize: "1.2rem" }} />
        </button>
        <div className="modal-data overflow-auto">{children}</div>
      </div>
    </article>
  );
};

export default Modal;
