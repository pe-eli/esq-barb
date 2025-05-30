import { useState } from "react";
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
        <img className="logo" src="/Header/logo.png" alt="Logo da barbearia" />

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
