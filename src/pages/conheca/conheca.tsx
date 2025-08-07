import './conheca.css';
import { Link } from 'react-router-dom'
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';

function Cnt() {
  return (
    <>

      <div className='intro-container'>
        <Header />
        <div className='foto-descricao'>
        <img
          className="profile-pic"
          src="/Conheca/bruno.jpg"
          alt="Foto de perfil"
        />
        <div className="profile-content">
          <h1 style={{marginBottom: 0}}>01 do Cort</h1>
          <p style={{margin: 0}}>O barbeiro dos jogadores!</p>
          <p>
            Com experiência em cortes, estilos e atendimento personalizado,
            estou sempre em busca de novos desafios para evoluir como barbeiro
            e entregar o melhor para cada cliente.
          </p>
        </div>
        <h2 className="se-liga">Se liga nos cortes!</h2>
        <div className="portfolio">
        
            <img src="Conheca/corte1.jpg" alt="" />
            <img src="Conheca/corte2.jpg" alt="" />
            <img src="Conheca/corte3.jpg" alt="" />
            <img src="Conheca/corte4.jpg" alt="" />
   
        </div>
        <h2 className='brabo' style={{margin: 0, color: '#F5D101'}}>Brabo, né? Não perca tempo e agende já seu corte!</h2>
        <Link className="agendeja" to="/agendamento">Agende seu corte!</Link> 
        </div>
        
     </div>
     <Footer/>
    </>
  );
}

export default Cnt;
