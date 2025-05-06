import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // или используйте состояние из Redux

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children; // Если авторизован, рендерим дочерний компонент
};

export default PrivateRoute;
