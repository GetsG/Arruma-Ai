import estilos from "./ocorrencia.module.css";
import Image from "next/image";

import pendente from "./Icones/pendente.png"
import emAndamento from "./Icones/emAndamento.png"
import resolvida from "./Icones/resolvida.png"

export default function Ocorrencia({id, data, tipo, bairro, status, image}){
    return(
    
        <div className={estilos.container}>
            <div className={estilos.infos}>
                <p><strong>Protocolo: #{id}</strong></p>
                <p><strong>Ultima atualização:</strong> {data}</p>
                <p><strong>Tipo:</strong> {tipo}</p>
                <p><strong>Bairro:</strong> {bairro}</p>

                <div className={estilos.status}>
                    <p><strong>Status:</strong> {status}</p>
                    <Image className={estilos.imagemStatus} src={status === "Pendente" ? pendente : status === "Em andamento" ? emAndamento : resolvida} alt="Status da ocorrencia"/>
                </div>
            </div>

            <div className={estilos.detalhes}>
                <Image className={estilos.img} src={pendente} alt="Imagem da ocorrencia"/>
                <button className={estilos.verDetalhes}>Ver detalhes</button>
            </div>
        </div>

        
    );
}