import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home/home";
import Agende from "../pages/Agende/agende";
import MeusAgendamentos from "../pages/meusagendamentos/meusagendamentos";
import AdmAgendamentos from "../pages/adm/adm"; // nome com letra maiúscula!

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agende />} />
        <Route path="/meusagendamentos" element={<MeusAgendamentos />} />
        <Route path="/adm" element={<AdmAgendamentos />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
