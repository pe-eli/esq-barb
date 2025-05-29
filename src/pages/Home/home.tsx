import Footer from '../../components/Footer/footer';
import Header from '../../components/Header/header';
import './home.modules.css';

function Home() {
  return (
    <>
      <Header />
      <section className='esticar-home'>
        <div className="centralize">
          <img className="title" src="./public/Home/nome.png" alt="Esquadrão Barbearia" />
          <h3 className="slogan">Cabelo na régua, confiança no topo.</h3>
          <button className="button-cnt">Conheça nosso trabalho</button>
        </div>
      </section>




      <section className='about-section'>
      <div className='apresentacao'>
      <h2 className='idealizador'>O idealizador</h2>
      <p className='descricao-bruno'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
        It has survived not only five centuries, but also the leap into electronic typesetting, 
        remaining essentially unchanged. It was popularised in the 1960s with the release 
        of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop 
        publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
      <figure className='picture'>
      <img className='foto-bruno' src="./public/Sobre/bruno.webp" alt="Bruno Estevam, fundador da barbearia." />
      <figcaption className='figcaption'>Bruno Estevam, fundador da Esquadrão Barbearia.</figcaption>
      </figure>
    </section>






    <div className='espaco-section'>
            <div className='components-espaco'>
            <h2>Minha barbearia</h2>
            <p className='sobre-barbearia'>Com mais de 10 anos de experiência, 
                somos referência em tratamentos de 
                beleza personalizados. Nossa equipe 
                de profissionais qualificados está 
                pronta para proporcionar a melhor experiência, 
                em um ambiente acolhedor e moderno.</p>
            <div className='icones-descritivos'>
                <div className='cjt-icone-texto'>
                    <div className='circulo'>
                        <h1 className='icone-geral'>
                            <img className='icone'src="./public/Espaço/lamina-de-barbear.png" alt="" />
                        </h1>
                    </div>
                    <h2 className='descricao-icone'>Oferecemos apenas o melhor 
                        para nossos clientes, com 
                        produtos de primeira linha.</h2>
                </div>


                <div className='cjt-icone-texto'>
                <div className='circulo'>
                    <h1 className='icone-geral'>
                        <img className='icone' src="./public/Espaço/penteado.png"/>
                    </h1>
                </div>
                    <h2 className='descricao-icone'>Com anos de experiência, 
                        ofereço um serviço personalizado e dedicado para 
                        cada cliente.</h2>
                </div>

                <div className='cjt-icone-texto'>
                <div className='circulo'>
                    <h1 className='icone-geral'>
                        <img className='icone' src="./public/Espaço/barbearia.png"/>
                    </h1>
                
                </div>
                    <h2 className='descricao-icone'>Ambiente criado para 
                        oferecer conforto e qualidade no seu atendimento.</h2>
                </div>
            </div>
            </div>
            
        </div>




        <div className='local-section'>
            <div className='onde-estamos'>
                <h1>Onde estamos</h1>
                <span className='span'>Endereço:</span>
                <p>Rua 50, n°65 - Vila Santa Cecília, Volta Redonda - RJ, 27261-040</p>

                <span className='span'>Horário de funcionamento:</span>
                <p>Segunda a Sexta: 09h às 20h</p>
                <p>Sábado: 07h às 13h</p>


                <span className='span'>Entre em contato:</span>
                <p>esquadraobarbearia@email.com</p>
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
