import React, { memo, useContext } from "react";
import CrudContext from "../../../Context/CrudContext";
import { useForm } from "../../../hooks/useForm";
import { bgColors } from "../../colors";
import Loader from "../../Loader";
import Message from "../../Message";

const validationsForm = (form) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let errors = {};

  if (!form.name.trim()) {
    errors.name = "Llena el campo nombre";
  } else if (!regexName.test(form.name.trim())) {
    errors.name = "El campo nombre solo acepta letras y espcios en blanco ' '";
  }

 

  return errors;
};

const FormCategory = () => {
  const { dataToEdit, closeModalForm } = useContext(CrudContext);

  const initialForm = {
    id: null,
    name: "",
    state: false,
  };

  const {
    form,
    errors,
    response,
    loading,
    handleChange,
    handleChecked,
    handleBlur,
    handleSubmit,
    handleReset,
  } = useForm(initialForm, validationsForm);

  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <div className="form-floating mb-3 mt-5">
          <input
            type="text"
            name="name"
            placeholder="Escribe tu nombre"
            onBlur={handleBlur}
            value={form.name}
            onChange={handleChange}
            className="form-control"
            id="name"
            required
          />
          <label htmlFor="name" className="fw-light">Nombre</label>
        </div>
        {errors.name && (
          <Message msg={errors.name} bgColor={bgColors.warning} />
        )}
        <div className="form-check form-switch mt-5 mb-5">
          <input
            className="form-check-input"
            name="state"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            checked={form.state}
            onChange={handleChecked}
          />
          <label className="form-check-label fw-light" htmlFor="flexSwitchCheckDefault">
            Estado
          </label>
        </div>
        {errors.state && (
          <Message msg={errors.state} bgColor={bgColors.warning} />
        )}
        <input
          className="btn btn-primary me-2"
          type="submit"
          value={dataToEdit ? "Actualizar" : "Crear"}
        />
        <input
          className="btn btn-danger"
          type="button"
          value={"Cerrar"}
          onClick={(e) => {
            handleReset(e, initialForm);
            closeModalForm();
          }}
        />
      </form>
      {loading && <Loader />}
      {response && <Message msg="Exito en el envio" bgColor={bgColors.exit} />}
    </div>
  );
};

export default memo(FormCategory);
