import estilos from "./ocorrencia.module.css";

export default function Ocorrencia({id, descricao, categoria, status}){
    return(
    
        <tr className={estilos.container}>
            <td className={status === "Aberto" ? estilos.status_aberto : estilos.status_fechado}>{status}</td>
            <td>{descricao}</td>
            <td>{categoria}</td>
        </tr>

        
    );
}