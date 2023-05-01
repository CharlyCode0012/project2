import React, { useState, useContext } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import LoginContext from "../../Context/LoginContext";
import { useForm } from "../../hooks/useForm";
import { bgColors } from "../colors";
import Loader from "../Loader";
import Message from "../Message";
import "./Login.css";

const validationsForm = (form) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
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

  if (!form.pass.trim()) {
    errors.pass = "El campo contraseña es requerido";
  } else if (
    !regexPass.test(form.pass.trim()) ||
    regexSigns.test(form.pass.trim())
  ) {
    errors.pass = 'Debe ser una contraseña robusta y no se permiten "-<>/</>"';
  }

  if (!form.cel.trim()) {
    errors.cel = "Llena el campo celular";
  } else if (!regexNum.test(form.cel.trim())) {
    errors.cel =
      "El campo celular solo acepta numeros y no mas de 10 digitos, (XX-XXXX-XXXX)";
  }
  return errors;
};

const Login = () => {
  const { error } = useContext(LoginContext);

  const initialForm = {
    name: "",
    cel: "",
    pass: "",
  };

  const { form, errors, handleChange, handleBlur, handleSubmitLogin, loading } = useForm(
    initialForm,
    validationsForm,
    error
  );


  const [showPass, setShowPass] = useState(false);
  return (
    <div className="div_body">
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">
                  Inicio de Sesión
                </h5>
                <form onSubmit={handleSubmitLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingName"
                      name="name"
                      placeholder="Carlos"
                      value={form.name??""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="floatingName" className="Josefin_Slab">
                      Nombre
                    </label>
                  </div>
                  {errors.name && (
                    <Message msg={errors.name} bgColor={bgColors.warning} />
                  )}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingCel"
                      name="cel"
                      placeholder="33-2524-8063"
                      value={form.cel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="floatingCel" className="Josefin_Slab">
                      Celular
                    </label>
                  </div>
                  {errors.cel && (
                    <Message msg={errors.cel} bgColor={bgColors.warning} />
                  )}
                  <div className="form-floating mb-3">
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      name="pass"
                      value={form.pass}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="floatingPassword" className="Josefin_Slab">
                      Contraseña
                    </label>
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
                  {errors.pass && (
                    <Message msg={errors.pass} bgColor={bgColors.warning} />
                  )}
                  <div className="d-grid">
                    <button
                      className="btn btn-secondary btn-login text-uppercase fw-bold"
                      type="submit"
                    >
                      Inciar sesión
                    </button>
                  </div>
                  <hr className="my-4" />
                  {loading && <Loader />}
                  {error && (
                    <Message
                      msg={`Error ${error.status}: ${error.statusText}`}
                      bgColor={bgColors.danger}
                    />
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
