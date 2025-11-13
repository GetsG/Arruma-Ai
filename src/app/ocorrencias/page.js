'use client'
import { useRouter } from 'next/navigation';

import estilos from "./ocorrencias.module.css"
import Nav from "../../componentes/Nav/Nav.jsx";
import CardOcorrencia from "../../componentes/CardOcorrencias/Ocorrencia.jsx";
import mapa from "../../../public/ocorrencias/mapa.png";
import mais from "../../../public/ocorrencias/mais.png";
import Image from "next/image";

export default function Ocorrencias(){
    const router = useRouter();

    const ocorrencias = [/*
    {id: 1, data: "27/05/2025", tipo: "Buraco em via", bairro: "Cidade Jardim", status: "Pendente"},
    {id: 2, data: "27/05/2025", tipo: "Cabos rompidos", bairro: "Campinas", status: "Em andamento" },
    {id: 3, data: "20/04/2025", tipo: "Lixo e entulho", bairro: "Jardim Europa", status: "Resolvido" },
*/];

    return(
        <>
            <div className={estilos.container}>
                <div className={estilos.container_topo}>
                    <h1>Minhas Solicitações</h1>
                    <p>Acompanhe aqui os problemas que ja reportou</p>
                </div>

                <div className={estilos.container_main}>
                    <p className={estilos.mensagem_solicitacao}>Solicitações enviadas :</p>

                {
                    ocorrencias.length === 0 ? (
                        <div className={estilos.sem_solicitacao}> 
                        <Image className={estilos.imagem_sem_solicitacao} src={mapa} alt="Não possui solicitações"/>
                        <h2>Você ainda não fez nenhuma solicitação</h2>
                        <p>Que tal começar agora?</p>

                        <button className={estilos.cadastrar_solicitacao} onClick={() => router.push("/cadastrar_ocorrencia")}><Image src={mais} alt="Cadastrar nova solicitação"/>Criar nova solicitação</button>
                        </div>
                    ) :
                        <div>
                        {ocorrencias.map((o) => (
                        <CardOcorrencia key={o.id} id={o.id} data={o.data} tipo={o.tipo} bairro={o.bairro} status={o.status}/>
                    ))}
                    </div>

                }

                    
                </div>
            </div>


            <Nav/>
        </>
    );
}