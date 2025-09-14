import estilos from './Token.module.css';

export default function(){
    return(
        <div className={estilos.container}>
                <h1>Digite o código</h1>
                <p>Enviamos um código de confirmação para <span>teste@gmail.com</span></p>
                <input></input>
                <div>
                    <button>Voltar</button>
                    <button>Enviar</button>
                </div>
                <button>Reenviar Código</button>
        </div>
    )
}