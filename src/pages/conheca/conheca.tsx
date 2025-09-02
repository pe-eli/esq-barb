import './conheca.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';

function Cnt() {
  return (
    <>
      <div className="intro-container">
        <Header />

        <div className="foto-descricao">
          <img
            className="profile-pic"
            src="/Conheca/barbeiro.png"
            alt="Foto de perfil"
          />

          <div className="profile-content">
            <h1 className="titulo-nome">Seu nome aqui</h1>
            <p className="descricao">
              Cada detalhe do meu trabalho é pensado para proporcionar 
              um corte de excelência, combinando técnica, 
              estilo e exclusividade.
            </p>
          </div>

          <h2 className="se-liga">Uma seleção dos cortes que definem meu estilo.</h2>

          <div className="portfolio">
            <img src="Conheca/corte1.jpg" alt="Corte 1" />
            <img src="Conheca/corte2.jpg" alt="Corte 2" />
            <img src="Conheca/corte3.jpg" alt="Corte 3" />
            <img src="Conheca/corte4.jpg" alt="Corte 4" />
          </div>

          <h2 className="brabo">Não deixe para depois: garanta já o seu horário.</h2>
          <Link className="agendeja" to="/agendamento">
            Agende seu corte!
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Cnt;
