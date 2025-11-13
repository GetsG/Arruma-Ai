import estilos from "./ocorrencias.module.css"
import Nav from "../../componentes/Nav/Nav.jsx";
import CardOcorrencia from "../../componentes/CardOcorrencias/Ocorrencia.jsx";

export default function Ocorrencias(){

    const ocorrencias = [
    {id: 1, data: "27/05/2025", tipo: "Buraco em via", bairro: "Cidade Jardim", status: "Pendente"},
    {id: 2, data: "27/05/2025", tipo: "Cabos rompidos", bairro: "Campinas", status: "Em andamento" },
    {id: 3, data: "20/04/2025", tipo: "Lixo e entulho", bairro: "Jardim Europa", status: "Resolvido" },
  ];

    return(
        <>
            <div>
                <div className={estilos.container_topo}>
                    <h1>Minhas Solicitações</h1>
                    <p>Acompanhe aqui os problemas que ja reportou</p>
                </div>

                <div className={estilos.container_main}>
                    <p>Solicitações enviadas :</p>

                    {ocorrencias.map((o) => (
                        <CardOcorrencia key={o.id} id={o.id} data={o.data} tipo={o.tipo} bairro={o.bairro} status={o.status}/>
                    ))}
                </div>
            </div>


            <Nav/>
        </>
    );
}