import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home/home";
import Agende from "../pages/Agende/agende";
import MeuPerfil from "../pages/Meuperfil/meuperfil";
import GerenciarServicos from "../pages/GerenciarServicos/GerenciarServicos";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agende />} />
        <Route path="/servicos" element={<GerenciarServicos />} />
        <Route path="/perfil" element={<MeuPerfil />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
