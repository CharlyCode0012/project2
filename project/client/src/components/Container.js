import React from "react";
import { LoginProvider } from "../Context/LoginContext.js";
import Rutas from "./Routes.js";

const Container = () => {
  return (
    <LoginProvider>
      <Rutas />
    </LoginProvider>
  );
};

export default Container;
