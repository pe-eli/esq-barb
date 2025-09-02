import Footer from '../../components/Footer/footer';
import Header from '../../components/Header/header';
import './home.modules.css';
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <div className="foto-de-fundo-mb"></div>
      <div className="foto-de-fundo-pc"></div>
      <Header/>
      <section className='esticar-home'>
        <div className="centralize">
          <h1 className='nome'>sua presença começa <strong style={{color: "#d8bda3ff"}}>aqui</strong></h1>
          <h2 style={{fontFamily: "Girassol", fontSize: "1.4rem"}}>- DESDE 2025 -</h2>
          <Link className="button-cnt" to="/conheca">Conheça nosso trabalho</Link>
        </div>
      </section>

      <section className='about-section'>
        <div className='apresentacao'>
          <h2 style={{margin: 0, color: "#3b2f2f", fontSize: "2.2rem"}}>O barbeiro</h2>
          <p className='descricao-bruno'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
             sunt in culpa qui officia deserunt mollit anim id est laborum
          </p>
        </div>
          <img className='foto' src="/Sobre/barbeiro.png" alt="Bruno Estevam, fundador da barbearia." />
      </section>

      <div className='espaco-section'>
        <div className='components-espaco'>
          <h2 className="tituloBranco">A barbearia</h2>
          <p className='sobre-barbearia'>Cada corte é feito com cuidado, técnica e atitude. Do clássico ao moderno, 
          a barbearia é pra quem valoriza presença.</p>
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
          <p>Rua Seu endereço, n° 1000 - Bairro, Cidade - Estado</p>

          <span className='span'>Horário de funcionamento:</span>
          <p>Segunda a Sábado: 07h às 20h</p>
          <p>Domingo: Fechado</p>

          <span className='span'>Entre em contato:</span>
          <p>(00) 99999-9999</p>
        </div>

        <div>
          <iframe className="mapa" style={{ borderRadius: '15px' }} 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467690.14386323624!2d-46.92495501665021!3d-23.682063558135205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2zU8OjbyBQYXVsbywgU1A!5e0!3m2!1spt-BR!2sbr!4v1756227524192!5m2!1spt-BR!2sbr"
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
