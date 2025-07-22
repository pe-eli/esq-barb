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
  const adminEmails = ['mp6171745@gmail.com', 'p.mouuraa05@gmail.com'];
const isAdmin = adminEmails.includes(user?.email ?? '');

  

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
          <button onClick={() => navigate('/')}>🏠 Home</button>
          <button onClick={() => navigate('/agendamento')}>🧍‍♂️ Novo Agendamento</button>
        </div>

        {isAdmin && (
          <div className="section">
            <p className="section-title">Admin</p>
            <button onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
            <button onClick={() => navigate('/admin/usuarios')}>👥 Gerenciar Usuários</button>
            <button onClick={() => navigate('/servicos')}>💈 Gerenciar Serviços</button>
          </div>
        )}

        <div className="section">
          <p className="section-title">Minha Conta</p>
          <button onClick={() => navigate('/perfil')}>👤 Meu Perfil</button>
          <button className="logout-button" onClick={handleLogout}>🚪 Sair</button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
