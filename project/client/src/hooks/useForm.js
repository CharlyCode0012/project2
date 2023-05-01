import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import CrudContext from "../Context/CrudContext";
import LoginContext from "../Context/LoginContext";

export const useForm = (initialForm, validateForm, error = null) => {
  const { dataToEdit, setDataToEdit, updateData, createData } =
    useContext(CrudContext);
  const cookies = new Cookies();
  const { handleLogin } = useContext(LoginContext);
  const [form, setForm] = useState(dataToEdit ? dataToEdit : initialForm);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    return () => {
      setErrors({});
      setResponse(null);
      setLoading(false);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleChecked = ({target}) => {
    const {name, checked} = target;
    setForm({
      ...form,
      [name]: checked,
    });
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    let temp = value.replace(/\s/g, "");
    let number = temp.match(/.{1,4}/g);

    if (Array.isArray(number)) number = number.join(" ");

    setForm({
      ...form,
      [name]: number,
    });
  };

  const handleReset = (e) => {
    setForm(initialForm);
    setDataToEdit(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value.trim(),
    });
    setErrors(validateForm(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors(validateForm(form));

    console.log(errors)
    console.log(!Object.keys(errors).length <= 0);
    if (Object.keys(errors).length > 0) {
      alert("hay errores");
      setResponse(false);
      return;
    }

    setLoading(true);
    if (form.id === null) {
      createData(form);
    } else {
      updateData(form);
    }
    setLoading(false);
    handleReset();
  };

  const handleSubmitPerfil = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));
    const user = cookies.get("user");
    
    if (!Object.keys(errors).length === 0) {
      alert("hay errores");
      setResponse(false);
      return;
    }

    setLoading(true);
    updateData(form);
    cookies.set("user", { ...user, ...form }, { path: "/" });
    setLoading(false);
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    setErrors(validateForm(form));

    if (!Object.keys(errors).length === 0) {
      alert("hay errores");
      setResponse(false);
      return;
    }

    setLoading(true);
    handleLogin(form);
    setLoading(false);
    handleReset();
  };

  return {
    form,
    errors,
    response,
    loading,
    handleChange,
    handleChecked,
    handleBlur,
    handleSubmit,
    handleSubmitPerfil,
    handleReset,
    handleChangeNumber,
    handleSubmitLogin,
  };
};
