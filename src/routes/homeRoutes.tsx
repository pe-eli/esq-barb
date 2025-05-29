import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import Agende from "../pages/Agende/agende";

function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/agendamento" element={<Agende />}></Route>           
        </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
