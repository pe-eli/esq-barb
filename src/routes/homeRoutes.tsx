import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home/home";
import Agende from "../pages/Agende/agende";
import MeusAgendamentos from "../pages/meusagendamentos/meusagendamentos";
import AdmAgendamentos from "../pages/adm/adm"; 
import Cnt from "../pages/conheca/conheca"
import GerenciarServicos from "../pages/GerenciarServicos/GerenciarServicos";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agende />} />
        <Route path="/meusagendamentos" element={<MeusAgendamentos />} />
        <Route path="/adm" element={<AdmAgendamentos />} />
        <Route path="/conheca" element={<Cnt/>} />
        <Route path="/gerenciar-servicos" element={<GerenciarServicos/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
