import { useState } from "react";
import { Link } from "react-router-dom";
import './logado.modules.css';
import SideMenu from '../SideMenu/sidemenu';
import { useNavigate } from "react-router-dom";

function HeaderLogado() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <>
      <header className="header">
        <div>
          <button className="logo-header" onClick={() => navigate("/home")}>
          <img className="logo" src="/Header/logo.png" alt="Logo da barbearia" />
         </button>
        </div>

        <div className="header-right">
          <Link to="/agendamento" className="agende-button">
            Agende seu corte!
          </Link>

          <button
            className="perfil-button"
            onClick={toggleMenu}
          >
            <img className="perfil" src="/Header/perfil.png" alt="Ícone do perfil" />
          </button>
        </div>
      </header>

      {menuAberto && <SideMenu onClose={() => setMenuAberto(false)} />}
    </>
  );
}

export default HeaderLogado;
