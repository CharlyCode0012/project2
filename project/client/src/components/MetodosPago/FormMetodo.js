import React, { memo, useContext } from "react";
import CrudContext from "../../Context/CrudContext";
import { useForm } from "../../hooks/useForm";
import { bgColors } from "../colors";
import Message from "../Message";

const validationsForm = (form) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s0-9]+$/;
  let regexBank = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumCard = /^\d{4}\s{1}\d{4}\s{1}\d{4}\s{1}\d{4}$/;
  let regexNumClabe = /^\d{4}\s{1}\d{4}\s{1}\d{4}\s{1}\d{4}\s{1}\d{2}$/;
  let regexSubsidary = /^.{1,200}$/;
  let errors = {};

  if (!form.name.trim()) {
    errors.name = "Llena el campo nombre";
  } else if (!regexName.test(form.name.trim())) {
    errors.name =
      "El campo nombre solo acepta letras, espcios en blanco ' ' y números";
  }

  if (!form.CLABE.trim()) {
    errors.CLABE = "El campo CLABE es requerido";
  } else if (!regexNumClabe.test(form.CLABE.trim())) {
    errors.CLABE =
      "El campo sólo acepta números en el formato 0000 0000 0000 00";
  }

  if (!form.no_card.trim()) {
    errors.no_card = "El campo No. Tarjeta es requerido";
  } else if (!regexNumCard.test(form.no_card.trim())) {
    errors.no_card =
      "El campo sólo acepta números en el formato 0000 0000 0000";
  }

  if (!form.bank.trim()) {
    errors.bank = "El campo Banco es requerido";
  } else if (!regexBank.test(form.bank.trim())) {
    errors.bank = "Solo acepta letras y espacios ' '";
  }

  if (!regexSubsidary.test(form.subsidary.trim())) {
    errors.subsidary =
      "El campo subisdarios tiene un rango de 1 a 200 caracteres";
  }
  return errors;
};

const FormMetodo = () => {
  const { dataToEdit, closeModalForm } = useContext(CrudContext);

  const initialForm = {
    id: null,
    name: "",
    CLABE: "",
    no_card: "",
    bank: "",
    subsidary: "",
  };

  const {
    form,
    errors,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    handleChangeNumber,
  } = useForm(initialForm, validationsForm);

  /* console.log("form.name: ", form.name); */
  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <div tabIndex="0" className="form-floating">
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
          <label htmlFor="name">Nombre</label>
        </div>
        {errors.name && (
          <Message msg={errors.name} bgColor={bgColors.warning} />
        )}
        <div className="form-floating">
          <input
            type="text"
            name="CLABE"
            value={form.CLABE}
            onChange={handleChangeNumber}
            onBlur={handleBlur}
            className="form-control"
            id="CLABE"
            required
          />
          <label htmlFor="CLABE">CLABE</label>
        </div>
        {errors.CLABE && (
          <Message msg={errors.CLABE} bgColor={bgColors.warning} />
        )}
        <div className="form-floating">
          <input
            type="text"
            name="no_card"
            value={form.no_card}
            onBlur={handleBlur}
            onChange={handleChangeNumber}
            className="form-control mb-3"
            id="no_card"
            required
          />
          <label htmlFor="no_card">No. Tarjeta</label>
        </div>
        {errors.no_card && (
          <Message msg={errors.no_card} bgColor={bgColors.warning} />
        )}
        <div className="form-floating">
          <input
            type="text"
            name="bank"
            placeholder="Banco"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.bank}
            className="form-control"
            id="bank"
            required
          />
          <label htmlFor="bank">Banco</label>
        </div>
        {errors.bank && (
          <Message msg={errors.bank} bgColor={bgColors.warning} />
        )}

        <div className="form-floating">
          <textarea
            name="subsidary"
            onBlur={handleBlur}
            value={form.subsidary}
            onChange={handleChange}
            className="form-control mb-3 mt-2"
            id="subsidary"
            style={{ minHeight: "6rem" }}
            required
          ></textarea>
          <label htmlFor="subsidary">Subsidarias</label>
        </div>
        {errors.subsidary && (
          <Message msg={errors.subsidary} bgColor={bgColors.warning} />
        )}

        <input
          className="btn btn-primary me-2"
          type="submit"
          value={dataToEdit ? "Actualizar" : "Crear"}
        />
        <input
          className="btn btn-danger"
          type="submit"
          value={"Cerrar"}
          onClick={(e) => {
            handleReset(e, initialForm);
            closeModalForm();
          }}
        />
      </form>
      {response && <Message msg="Exito en el envio" bgColor={bgColors.exit} />}
    </div>
  );
};

export default memo(FormMetodo);
