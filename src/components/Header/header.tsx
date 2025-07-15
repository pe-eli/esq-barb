import { Link } from 'react-router-dom'
import './header.modules.css'

function Header(){
    return(
        <>
            
            <header>   

                <img className="logo" src="./public/Header/logo.png" alt="Logo da barbearia" />
                <div className='botoes-header'>
                    <Link className="agende" to="/agendamento">Agende seu corte</Link>
              
                
                
                
                </div>
            </header>
            </>
             )
                    }

export default Header

