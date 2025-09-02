import './footer.css'

function Footer(){
    return(
        <footer className='footer'>

            <div className='barbearia'>
                <h3 style={{ fontSize: '1.375rem', color: 'white' }}>Barbearia</h3>
                <p className='texto-footer'>Nosso compromisso é oferecer serviços de 
                    alta qualidade, com produtos premium e 
                    profissionais capacitados, proporcionando 
                    uma experiência única.</p>
            </div>

            <div>
                <h3 style={{ fontSize: '1.375rem', color: 'white' }}>Contato</h3>
                <p className='texto-footer'>suabarbearia@email.com</p>
                <p className='texto-footer'>(00) 99999-9999</p>
            </div>

            <div className='redes-sociais'>
                <h3 style={{ fontSize: '1.375rem', color: 'white' }}>Redes sociais</h3>
                <div className='separar-redes'>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <img src="/Footer/instagram.png" alt="Instagram" style={{ width: '30px', height: '30px', filter: "invert(1)" }} />
                    </a>

                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                        <img src="/Footer/whatsapp.png" alt="WhatsApp" style={{ width: '30px', height: '30px', filter: "invert(1)" }} />
                    </a>
                </div>
            </div>

            {/* Marca Prottocode no final */}
            <div className='footer-marca'>
                <p>Site desenvolvido por @prottocode.</p>
            </div>

        </footer>
    )
}

export default Footer;
