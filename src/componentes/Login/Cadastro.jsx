import estilos from './Cadastro.module.css'
import Link from "next/link";

export default function Cadastro(){
    return(
        <div className={estilos.container}>
            <h1>Criar conta</h1>
        
            <div>
                <p>Nome Completo:</p>
                <input></input>
            </div>

            <div>
                <p>E-mail:</p>
                <input></input>
            </div>

            <div>
                <p>Criar senha:</p>
                <input type="password"></input>
            </div>

            <div>
                <p>Repetir senha:</p>
                <input type="password"></input>
            </div>

            <div>
                <p>Telefone:</p>
                <input></input>
            </div>

            <div>
                <p>CEP:</p>
                <input></input>
            </div>

            <div className={estilos.termos}>
                <input type="checkbox" id="termos" name="termos" />
                <div className={estilos.texto_termos}>
                    <label>  Eu li e aceito os <a href="#">termos de uso</a>. </label>
                </div>
            </div>

            <div className={estilos.container_botoes}>
                <Link href="/">
                    <button>Cancelar</button>
                </Link>

                <Link href="/registrar/codigo">
                    <button className={estilos.cadastrar}>Cadastrar</button>
                </Link>
            </div>
        </div>
    )
}