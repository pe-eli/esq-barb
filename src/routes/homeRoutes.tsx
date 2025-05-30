import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import Agende from "../pages/Agende/agende";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/agendamento" replace /> : <Login />
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/agendamento"
          element={
            <PrivateRoute>
              <Agende />
            </PrivateRoute>
          }
        />

        {/* Rota fallback: qualquer rota inválida redireciona para / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
