import estilos from './Token.module.css';

export default function(){
    return(
        <div>
            <h1>Digite o código</h1>
            <p>Enviamos um código de confirmação para <span>teste@gmail.com</span></p>
            <input></input>
            <button>Voltar</button>
            <button>Enviar</button>
            <button>Reenviar Código</button>
        </div>
    )
}