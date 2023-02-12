import React, { useState, useEffect, createContext } from "react";
import { helpHTTP } from "../helper/helpHTTP";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext();

function LoginProvider({ children }) {
  const url = "http://localhost:3200/api/users/login"; //dev-back
  const [error_, setError_] = useState(null);
  const [responseLogin, setResponseLogin] = useState(false);

  let api = helpHTTP();

  const navigate = useNavigate();
  useEffect(() => {
    const cookies = new Cookies();

    if (!cookies.get("user") || cookies.get("user") === undefined) {
      navigate("/iniciar-sesion", { replace: true });
    } else {
      if(cookies.get("user"))console.log(cookies.get('user'));
    }
  }, []);

  const handleLogin = async (data) => {
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    try {
      
      let res = await api.post(url, options);

      res.err = res.err === undefined? true : res.err;
      //console.log(res.err === undefined, typeof res == TypeError, typeof(res), typeof(TypeError));

      /*res.err no existe, res.err === undefined, undefined == false  */
      console.log(res.err);
      if (!res.err) {
        const cookies = new Cookies();
        /* Logging the response from the server. */

        cookies.set("user", res.success, { path: "/" });
        setError_(null);
        console.log(cookies.get("user"));
     
        navigate('/inicio',{replace: true});
      } else {
        setResponseLogin(false);
        setError_(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const data = {
    error_,
    handleLogin,
    responseLogin,
  };
  return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
}

export { LoginProvider };

export default LoginContext;
