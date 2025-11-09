import estilos from './codigo.module.css';

export default function Codigo(){

    

    return(
        <div className={estilos.container}>

            <h1>Digite o código</h1>

            <div className={estilos.texto}>
                <p>Um código de verificação foi enviado para o e-mail <span>teste@gmail.com</span>.</p>
                <p>Insira-o abaixo para prosseguir.</p>
            </div>

            <input></input>

            <div className={estilos.botoes}>
                <button>Voltar</button>
                <button className={estilos.enviar}>Enviar</button>
            </div>

            <button className={estilos.reenviar}>Reenviar Código (--/--)</button>
        </div>
    )
}