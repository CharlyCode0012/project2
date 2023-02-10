import React, { memo, useContext, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import CrudContext from "../../Context/CrudContext";
import { useForm } from "../../hooks/useForm";
import { bgColors } from "../colors";
import Loader from "../Loader";
import Message from "../Message";

const validationsForm = (form) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexNum = /^[2-9]{2}-{1}[0-9]{4}-{1}[0-9]{4}$/;
  let regexPass =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  let regexSigns = /[-<>/]+/g;
  let errors = {};

  if (!form.name.trim()) {
    errors.name = "Llena el campo nombre";
  } else if (!regexName.test(form.name.trim())) {
    errors.name = "El campo nombre solo acepta letras y espcios en blanco ' '";
  }

  if (!form.e_mail.trim()) {
    errors.e_mail = "El campo correo es requerido";
  } else if (!regexEmail.test(form.e_mail.trim())) {
    errors.e_mail = "El campo correo es incorrecto";
  }

  if (!form.pass.trim()) {
    errors.pass = "El campo contraseña es requerido";
  } else if (
    !regexPass.test(form.pass.trim()) ||
    regexSigns.test(form.pass.trim())
  ) {
    errors.pass = 'Debe ser una contraseña robusta y no se permiten "-<>/</>"';
  }

  if (!form.date_B.trim()) {
    errors.date_B = "El campo Fecha es requerido";
  }

  if (!form.type_use.trim()) {
    errors.type_use = "seleccione un Rol de Usuario";
  }

  if (!form.cel.trim()) {
    errors.cel = "Llena el campo nombre";
  } else if (!regexNum.test(form.cel.trim())) {
    errors.cel =
      "El campo celular solo acepta numeros y no mas de 10 digitos, (XX-XXXX-XXXX)";
  }
  return errors;
};

const FormUs = () => {
  const { dataToEdit, closeModalForm } = useContext(CrudContext);

  const [showPass, setShowPass] = useState(false);
  const [click, setClick] = useState(0);
  const initialForm = {
    id: null,
    name: "",
    e_mail: "",
    date_B: "",
    type_use: "",
    pass: "",
    cel: "",
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

  const generatePass = () => {
    const base =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.¿?_,;!*&%$|#+";
    const min = Math.ceil(8);
    const max = Math.floor(15);
    const longitud = Math.floor(Math.random() * (max - min + 1) + min);

    let aleatoria = "";
    for (let i = 0; i < longitud; i++) {
      aleatoria += base.charAt(Math.floor(Math.random() * base.length));
    }
    //console.log(aleatoria);
    return aleatoria;
  };

   console.log("form.name: ", form.name);
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
          <input
            type="email"
            name="e_mail"
            placeholder="ejemplo@algo.com"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.e_mail}
            className="form-control"
            id="email"
            required
          />
          <label htmlFor="email">E-mail</label>
        </div>
        {errors.e_mail && (
          <Message msg={errors.e_mail} bgColor={bgColors.warning} />
        )}
        <div className="form-floating mt-3">
          <input
            type={showPass ? "text" : "password"}
            name="pass"
            placeholder="eXamp$01"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.pass}
            className="form-control position-relative"
            id="pass"
            required
          />
          <label htmlFor="pass">Contraseña</label>

          {showPass ? (
            <BsEyeSlashFill
              className="position-absolute pointer"
              style={{ top: "40%", right: "5%", fontSize: "1.2rem" }}
              onClick={(e) => {
                setShowPass(!showPass);
              }}
            />
          ) : (
            <BsEyeFill
              className="position-absolute pointer"
              style={{ top: "40%", right: "5%", fontSize: "1.2rem" }}
              onClick={(e) => {
                setShowPass(!showPass);
              }}
            />
          )}
        </div>
        {!dataToEdit && (
          <div className="form-floatinf">
            <button
              type="reset"
              className="btn btn-secondary"
              onClick={() => {
                form.pass = generatePass();
                setClick(click + 1);
                console.log(form.pass);
              }}
            >
              Generar
            </button>
          </div>
        )}

        {errors.pass && (
          <Message msg={errors.pass} bgColor={bgColors.warning} />
        )}
        <div className="form-floating">
          <input
            type="date"
            name="date_B"
            placeholder="2003-17-01"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.date_B}
            className="form-control"
            id="date"
            required
          />
          <label htmlFor="date">Fecha de Nacimiento</label>
        </div>
        {errors.date_B && (
          <Message msg={errors.date_B} bgColor={bgColors.warning} />
        )}

        <div className="form-floating">
          <select
            name="type_use"
            onChange={handleChange}
            onBlur={handleBlur}
            defaultValue={form.type_use}
            className="form-select mt-3"
            id="user"
            required
          >
            <option value="">--Elige un Rol--</option>
            <option value="ayudante">Ayudante</option>
            <option value="admin">Admin</option>
          </select>
          <label htmlFor="user">Tipo de usuario</label>
        </div>
        {errors.type_use && (
          <Message msg={errors.type_use} bgColor={bgColors.warning} />
        )}

        <div className="form-floating">
          <input
            type="tel"
            pattern="[0-9]{2}-[0-9]{4}-[0-9]{4}"
            name="cel"
            placeholder="33-3524-9067"
            onBlur={handleBlur}
            value={form.cel}
            onChange={handleChange}
            className="form-control mb-3"
            id="cel"
            required
          />
          <label htmlFor="cel">Celular</label>
        </div>
        {errors.cel && <Message msg={errors.cel} bgColor={bgColors.warning} />}

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

export default memo(FormUs);
