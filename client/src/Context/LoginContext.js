import React, { useState, useEffect, createContext } from "react";
import { helpHTTP } from "../helper/helpHTTP";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext();

function LoginProvider({ children }) {
  const url = "http://localhost:3200/api/users/login"; //dev-back
  const [error, setError] = useState(null);
  const [responseLogin, setResponseLogin] = useState(false);

  let api = helpHTTP();

  const navigate = useNavigate();
  useEffect(() => {
    const cookies = new Cookies();

    if (!cookies.get("user")) {
      navigate("/iniciar-sesion", { replace: true });
    } else {
      console.log(cookies.get('user').success)
    }
  }, []);

  const handleLogin = async (data) => {
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    let res = await api.post(url, options);

    if (!res.err) {
      const cookies = new Cookies();
      cookies.set("user", res, { path: "/" });
      setError(null);
      navigate('/inicio',{replace: true});
    } else {
      setResponseLogin(false);
      setError(res);
    }
  };

  const data = {
    error,
    handleLogin,
    responseLogin,
  };
  return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
}

export { LoginProvider };

export default LoginContext;
