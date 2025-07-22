import './footer.css'

function Footer(){
    return(
        <footer className='footer'>

            <div className='barb-esquadrao'>
            <h3 style={{ fontSize: '1.375rem', color: 'white' }}>Esquadrão Barbearia</h3>
            <p className='texto-footer'>Nosso compromisso é oferecer serviços de 
                alta qualidade, com produtos premium e 
                profissionais capacitados, proporcionando 
                uma experiência única.</p>
            </div>

            <div>
            <h3 style={{ fontSize: '1.375rem', color: 'white' }}>Contato</h3>
            <p className='texto-footer'>esquadraobarbearia@email.com</p>
            <p className='texto-footer'>(24) 99861-4631</p>
            </div>

            <div className='redes-sociais'>
            <h3 style={{ fontSize: '1.375rem', color: 'white' }}>Redes sociais</h3>

                <div className='separar-redes'>
                <a href="https://www.instagram.com/esquadraobarbearia/" target="_blank" rel="noopener noreferrer">
                    <img src="./public/Footer/instagram.png" alt="Instagram" style={{ width: '30px', height: '30px' }} />
                </a>

                <a href="https://wa.me/5524998614631" target="_blank" rel="noopener noreferrer">
                    <img src="./public/Footer/whatsapp.png" alt="Instagram" style={{ width: '30px', height: '30px' }} />
                </a>
                </div>
            </div>

        </footer>
    )
}

export default Footer;