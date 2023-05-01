import React, { memo, useContext} from "react";
import CrudContext from "../../../Context/CrudContext";
import { useForm } from "../../../hooks/useForm";
import { bgColors } from "../../colors";
import Loader from "../../Loader";
import Message from "../../Message";
import { SelectOption } from "../Categorías/OptionCategories";

//const urlCategory = "https://server-production-4487.up.railway.app/api/categories; //prod
const urlCategory = "http://localhost:3200/api/categories"; //dev-back
const validationsForm = (form) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexKeyWord = /^.{1,80}$/;
  //let regexPrice = /^[\d.]+$/;
  let regexStock = /^[\d]+$/;
  let errors = {};

  if (!form.name.trim()) {
    errors.name = "Llena el campo nombre";
  } else if (!regexName.test(form.name.trim())) {
    errors.name = "El campo nombre solo acepta letras y espcios en blanco ' '";
  }

  if (!form.price) {
    errors.price = "El campo precio es requerido";
  }

  if (!form.key_word.trim()) {
    errors.key_word = "El campo palabra clave es requerido";
  }else if(!regexKeyWord.test(form.key_word.trim())){
    errors.key_wordv = "Solo se puede de 1 a 80 caracteres";
  }

  if (!form.stock) {
    errors.stock = "El campo contraseña es requerido";
  } else if (!regexStock.test(form.stock)) {
    errors.stock = 'Debe ser una contraseña robusta y no se permiten "-<>/</>"';
  }

  if (!form.category.trim()) {
    errors.category= "seleccione un Rol de Usuario";
  }
  return errors;
};

const FormProduct = () => {
  const { closeModalForm } = useContext(CrudContext);
  const initialForm = {
    id: null,
    name: "",
    key_word: "",
    category: "",
    price: 0.00,
    stock: 0,
  };

  const {
    form,
    errors,
    response,
    loading,
    handleChange,
    handleBlur,
    handleSubmitPerfil,
    handleReset,
  } = useForm(initialForm, validationsForm);

  /* console.log("form.name: ", form.name); */
  return (
    <div className="container">
      <div className="row justify-content-center pe-2 mt-5">
        <form onSubmit={handleSubmitPerfil} className="">
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
          <div className="form-floating mb-2 mt-2">
            <textarea
              name="key_word"
              placeholder="Escribe una palabra clave"
              onBlur={handleBlur}
              value={form.key_word}
              onChange={handleChange}
              className="form-control"
              style={{ minHeight: "6rem", resize: "none" }}
              id="key_word"
              required
            ></textarea>
            <label htmlFor="key_word" className="fw-light">
              Palabra Clave
            </label>
          </div>
          {errors.key_word && (
            <Message msg={errors.key_word} bgColor={bgColors.warning} />
          )}
          <div className="form-floating">
            <input
              type="number"
              name="price"
              placeholder="10.0"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.price}
              className="form-control mb-2"
              id="price"
              required
            />
            <label htmlFor="price">Price</label>
          </div>
          {errors.price && (
            <Message msg={errors.price} bgColor={bgColors.warning} />
          )}
          <div className="form-floating">
            <input
              type="number"
              name="stock"
              placeholder="5"
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.stock}
              className="form-control"
              id="stock"
              required
            />
            <label htmlFor="stock">No. Existencia</label>
          </div>
          {errors.stock && (
            <Message msg={errors.stock} bgColor={bgColors.warning} />
          )}
          <div className="form-floating mb-3">
            <select
              name="category"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={form.category}
              className="form-select mt-3"
              id="category"
              required
            >
              <SelectOption url={urlCategory}/>
            </select>
            <label htmlFor="category">Categoría</label>
          </div>
          {errors.category && (
            <Message msg={errors.category} bgColor={bgColors.warning} />
          )}

          <input
            className="btn btn-primary me-2"
            type="submit"
            value="Actualizar"
          />
          <input
            className="btn btn-danger"
            type="button"
            value={"Cancelar"}
            onClick={(e) => {
              handleReset(e, initialForm);
              closeModalForm();
            }}
          />
        </form>
        {loading && <Loader />}
        {response && (
          <Message msg="Exito en el envio" bgColor={bgColors.exit} />
        )}
      </div>
    </div>
  );
};

export default memo(FormProduct);
