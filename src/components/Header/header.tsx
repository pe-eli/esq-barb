import { Link } from 'react-router-dom'
import './header.modules.css'

function Header() {
    return (
        <>
            <header>   
                <Link to="/">
                    <img className="logo" src="/Home/nome.png" alt="Logo da barbearia" />
                </Link>
                <div className='botoes-header'>
                    <Link className="consulta" to="/meusagendamentos">Meus agendamentos</Link>
                    <Link className="agende" to="/agendamento">Agende seu corte</Link> 
                </div>
            </header>
        </>
    )
}

export default Header
