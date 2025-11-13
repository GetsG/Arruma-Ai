import estilos from "./ocorrencia.module.css";
import Image from "next/image";

import pendente from "./Icones/pendente.png"
import emAndamento from "./Icones/emAndamento.png"
import resolvida from "./Icones/resolvida.png"

export default function Ocorrencia({id, data, tipo, bairro, status, image}){
    return(
    
        <div className={estilos.container}>
            <div>
                <p>Protocolo: {id}</p>
                <p>Ultima atualização: {data}</p>
                <p>Tipo: {tipo}</p>
                <p>Bairro: {bairro}</p>
                <div>
                    <p>Status: {status}</p>
                    <Image src={status === "Pendente" ? pendente : status === "Em andamento" ? emAndamento : resolvida} alt="Status da ocorrencia"/>
                </div>
            </div>

            <div>
                <Image src={image} alt="Imagem da ocorrencia"/>
                <button>Ver detalhes</button>
            </div>
        </div>

        
    );
}