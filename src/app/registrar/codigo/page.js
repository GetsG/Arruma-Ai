import Header from '@/componentes/Header/Header';
import Token from '@/componentes/Login/Token';
import estilos from './codigo.module.css';

export default function Codigo(){
    return(
        <div className={estilos.container}>
            <Header/>
            <div className={estilos.token}>
                <Token/>
            </div>
        </div>
    )
}