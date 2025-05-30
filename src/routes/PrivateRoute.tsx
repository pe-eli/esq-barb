import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Carregando...</p>;

  // Permitir acesso irrestrito à página inicial
  if (location.pathname === "/") {
    return children;
  }

  // Proteger outras rotas
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
