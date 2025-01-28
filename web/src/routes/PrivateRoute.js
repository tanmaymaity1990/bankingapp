import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token !== null ? children : <Navigate to="/" />;
};

export default PrivateRoute;
