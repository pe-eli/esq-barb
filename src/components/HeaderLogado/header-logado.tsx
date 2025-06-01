import { useState } from "react";
import { Link } from "react-router-dom"; // importe o Link
import './logado.modules.css';
import SideMenu from '../SideMenu/sidemenu';

function HeaderLogado() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <>
      <header className="header">
        {/* Link para a página home */}
        <Link to="/home">
          <img className="logo" src="/Header/logo.png" alt="Logo da barbearia" />
        </Link>

        <button
          className="perfil-button"
          onClick={toggleMenu}
        >
          <img className="perfil" src="/Header/perfil.png" alt="Ícone do perfil" />
        </button>
      </header>

      {menuAberto && <SideMenu onClose={() => setMenuAberto(false)} />}
    </>
  );
}

export default HeaderLogado;
