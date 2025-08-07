import Footer from '../../components/Footer/footer';
import Header from '../../components/Header/header';
import './home.modules.css';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate(); // 2. Criar função de navegação

  function handleClick() {
    navigate('/conheca'); // Navega para '/conheca'
  }

  return (
    <>
      <div className="foto-de-fundo-mb"></div>
      <div className="foto-de-fundo-pc"></div>
      <Header/>
      <section className='esticar-home'>
        <div className="centralize">
          <img className="title" src="/Home/nome.png" alt="Esquadrão Barbearia" />
          <h3 className="slogan">Cabelo na régua, confiança no topo.</h3>
          <button className="button-cnt" onClick={handleClick}>Conheça nosso trabalho</button>
        </div>
      </section>

      <section className='about-section'>
        <div className='apresentacao'>
          <h2 style={{margin: 0}}>O idealizador</h2>
          <p className='descricao-bruno'>A ideia da Esquadrão Barbearia surgiu entre uma conversa e outra sobre estilo, 
            atitude e propósito. Bruno Estevam queria criar um espaço onde cada cliente se sentisse parte de 
            algo maior — um verdadeiro esquadrão. Com bom atendimento, profissionalismo e 
            aquele papo reto, a barbearia virou referência.
          </p>
        </div>
        <figure className='picture'>
          <img className='foto-bruno' src="/Sobre/bruno.webp" alt="Bruno Estevam, fundador da barbearia." />
          <figcaption className='figcaption'>Bruno Estevam, fundador da Esquadrão Barbearia.</figcaption>
        </figure>
      </section>

      <div className='espaco-section'>
        <div className='components-espaco'>
          <h2 className="tituloBranco">Minha barbearia</h2>
          <p className='sobre-barbearia'>Cada corte é feito com cuidado, técnica e atitude. Do clássico ao moderno, 
          a Esquadrão é pra quem valoriza presença.</p>
          <div className='icones-descritivos'>
            <div className='cjt-icone-texto'>
              <div className='circulo'>
                <h1 className='icone-geral'>
                  <img className='icone' src="/Espaço/lamina-de-barbear.png" alt="" />
                </h1>
              </div>
              <h2 className='descricao-icone'>Trabalhamos com as melhores ferramentas e técnicas para garantir 
                                              resultados de alto nível.</h2>
            </div>

            <div className='cjt-icone-texto'>
              <div className='circulo'>
                <h1 className='icone-geral'>
                  <img className='icone' src="/Espaço/penteado.png" />
                </h1>
              </div>
              <h2 className='descricao-icone'>Profissionalismo, estilo e dedicação. A tradição se une à 
                                              modernidade em cada corte.</h2>
            </div>

            <div className='cjt-icone-texto'>
              <div className='circulo'>
                <h1 className='icone-geral'>
                  <img className='icone' src="/Espaço/barbearia.png" />
                </h1>
              </div>
              <h2 className='descricao-icone'>Criamos um ambiente pensado para você relaxar e sair renovado, na vibe certa.</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='local-section'>
        <div className='onde-estamos'>
          <h1>Onde estamos</h1>
          <span className='span'>Endereço:</span>
          <p>Rua 50, n°65 - Vila Santa Cecília, Volta Redonda - RJ</p>

          <span className='span'>Horário de funcionamento:</span>
          <p>Segunda a Sábado: 07h às 20h</p>
          <p>Domingo: Fechado</p>

          <span className='span'>Entre em contato:</span>
          <p>(24) 99861-4631</p>
        </div>

        <div>
          <iframe className="mapa" style={{ borderRadius: '15px' }} 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1095.7137662806679!2d-44.10253339704682!3d-22.521918891218938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9ea3f9b475270d%3A0x55c602c3728c8408!2sBarbearia%20Volta%20Redonda%20-%20Esquadr%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1748321523742!5m2!1spt-BR!2sbr"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
