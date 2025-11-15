import Image from "next/image";
import atualizada from "./Icones/solicitação_atualizada.png"
import resolvido from "./Icones/problema_resolvido.png"
import manutencao from "./Icones/manutencao.png"
import recusada from "./Icones/solicitacao_recusada.png"
import contribuicao from "./Icones/contribuicao.png"
import estilos from "./cardNotificacoes.module.css"

export default function Notificacoes(props){
    return(
        <div className={estilos.container}>
            <Image className={estilos.icone} src={(props.titulo === "Sua solicitação foi atualizada !") ? atualizada 
            : props.titulo === "Problema resolvido!" ? resolvido
            : props.titulo === "Aviso de manutenção" ? manutencao
            : props.titulo === "Solicitação recusada" ? recusada
            : contribuicao
             }/>

            <div className={estilos.container_main}>
                <h1>{props.titulo}</h1>
                <p>{props.descricao}</p>
                <p>{props.data}</p>
            </div>
        </div>
    );
}