import React from 'react';
import './sidemenu.css';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onClose: () => void;
}

const SideMenu: React.FC<Props> = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Gera iniciais com base no email (ex: "jo@..." => "JO")
  const getInitials = () => {
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'US'; // Fallback
  };

  // Verifica se é admin pelo email
  const isAdmin = user?.email === 'mp6171745@gmail.com' || 'p.mouuraa05@gmail.com'; 
  

  return (
    <div className="side-menu">
      <div className="side-menu-header">
        <span>Menu</span>
        <button className="buttonfechar" onClick={onClose}>✕</button>
      </div>

      <div className="side-menu-content">
        <div className="user-box">
          <div className="user-avatar">{getInitials()}</div>
          <div>
            <p className="user-name">{user?.displayName || "Usuário"}</p>
            <span className="user-role">{isAdmin ? 'Administrador' : 'Cliente'}</span>

          </div>
        </div>

        <div className="section">
          <p className="section-title">Principal</p>
          <button className="botao-side" onClick={() => navigate('/')}>Home</button>
          <button className="botao-side" onClick={() => navigate('/agendamento')}>Novo agendamento</button>
        </div>

        {isAdmin && (
          <div className="section">
            <p className="section-title">Admin</p>
            <button className="botao-side" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="botao-side" onClick={() => navigate('/admin/usuarios')}>Gerenciar usuários</button>
            <button className="botao-side" onClick={() => navigate('/servicos')}>Gerenciar serviços</button>
          </div>
        )}

        <div className="section">
          <p className="section-title">Minha Conta</p>
          <button className="botao-side" onClick={() => navigate('/perfil')}>Meu perfil</button>
          <button className="logout-button" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
