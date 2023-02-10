
import React, { memo, useContext } from "react";
import CrudContext from "../../Context/CrudContext";
import { useForm } from "../../hooks/useForm";
import { bgColors } from "../colors";
import Loader from "../Loader";
import Message from "../Message";

const validationsForm = (form) => {
  let regexName = /^[\w\s]+$/;
  let regexAddress = /^.{1,200}$/;
  let regexCP = /^[0-9]{5}$/;
  let flagHorario = false;
  let regexHora = /^\d{2}:{1}\d{2}$/;

  let errors = {};

  if (!form.name.trim()) {
    errors.name = "Llena el campo nombre";
  } else if (!regexName.test(form.name.trim())) {
    errors.name = "El campo nombre solo acepta letras y espcios en blanco ' '";
  }

  if (!form.address.trim()) {
    errors.address = "El campo direccion es requerido";
  } else if (!regexAddress.test(form.address.trim())) {
    errors.address = "El campo direccion es incorrecto";
  }

  if (!form.cp.trim()) {
    errors.cp = "El campo de código postal es requerido";
  } else if (!regexCP.test(form.cp.trim())) {
    errors.cp = "Sólo se permite de 1 a 200 caracteres";
  }

  

  const open_h = parseInt(form.open_h.slice(0, 2));
  const close_h = parseInt(form.close_h.slice(0, 2));
  
  const open_m = parseInt(form.open_h.slice(3,5));
  const close_m = parseInt(form.close_h.slice(3,5));


  console.log(open_m);

  if (!form.open_h.trim()) {
    errors.open_h = "El campo de hora abierto es requerido";
  } else if (!regexHora.test(form.open_h.trim())) {
    errors.open_h = "Sólo se permite formato de 00:00";
  }

  if (!form.close_h.trim()) {
    errors.close_h = "El campo de hora cierre es requerido";
  } else if (!regexHora.test(form.open_h.trim())) {
    errors.open_h = "Sólo se permite formato de 00:00";
  }
  

  if(open_h > 23 || open_h < 0){
    errors.open_h ="No se puede tener horas mayores a 23 o menores a 0";
  }

  if(close_h > 23 || close_h < 0){
    errors.close_h ="No se puede tener horas mayores a 23 o menores a 0";
  }

  if(close_m > 59 || close_m < 0){
    errors.close_h ="No se puede tener mas de 59 o menos de 0 min";
  }

  if(open_m > 59 || open_m < 0){
    errors.open_h ="No se puede tener mas de 59 o menos de 0 min";
  }

  flagHorario = open_h >= close_h ? true : false;
  console.log(flagHorario);

  if (flagHorario) {
    errors.close_h =
      "El horario de cierre debe ser mayor por 1h";
  }

  return errors;
};

const FormLugar = () => {
  const { dataToEdit, closeModalForm } = useContext(CrudContext);

  const initialForm = {
    id: null,
    name: "",
    address: "",
    cp: "",
    open_h: "",
    close_h: "",
  };

  const {
    form,
    errors,
    response,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = useForm(initialForm, validationsForm);

  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <div className="form-floating">
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
          <textarea
            name="address"
            onBlur={handleBlur}
            value={form.address}
            onChange={handleChange}
            className="form-control mb-3 mt-2"
            id="address"
            style={{ minHeight: "6rem", resize: 'none' }}
            required
          ></textarea>
          <label htmlFor="address">Dirección</label>
        </div>
        {errors.address && (
          <Message msg={errors.address} bgColor={bgColors.warning} />
        )}
        <div className="form-floating">
          <input
            type="text"
            name="cp"
            placeholder="Escribe tu nombre"
            onBlur={handleBlur}
            value={form.cp}
            onChange={handleChange}
            className="form-control"
            id="cp"
            required
          />
          <label htmlFor="cp">Código Postal</label>
        </div>
        {errors.cp && <Message msg={errors.cp} bgColor={bgColors.warning} />}

        <div className="form-floating">
          <input
            type="text"
            name="open_h"
            placeholder="Escribe hora de apertura"
            onBlur={handleBlur}
            value={form.open_h}
            onChange={handleChange}
            className="form-control"
            id="open_h"
            required
          />
          <label htmlFor="open_h">Hora Apertura</label>
        </div>
        {errors.open_h && (
          <Message msg={errors.open_h} bgColor={bgColors.warning} />
        )}

        <div className="form-floating mb-2">
          <input
            type="text"
            name="close_h"
            placeholder="Escribe hora de cierre"
            onBlur={handleBlur}
            value={form.close_h}
            onChange={handleChange}
            className="form-control"
            id="close_h"
            required
          />
          <label htmlFor="close_h">Hora Cierre</label>
        </div>
        {errors.close_h && (
          <Message msg={errors.close_h} bgColor={bgColors.warning} />
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

export default memo(FormLugar);
