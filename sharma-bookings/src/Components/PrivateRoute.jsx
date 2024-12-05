import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ requiredRole }) => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login-user" />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="login-hotel-owner" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
