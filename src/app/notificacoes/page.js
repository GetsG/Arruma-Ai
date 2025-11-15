import estilos from "./notificacoes.module.css"
import semNotificacao from "../../../public/notificacoes/semNotificacao.png"
import Image from "next/image";
import Nav from "../../componentes/Nav/Nav.jsx"
import CardNotificacoes from "../../componentes/CardNotificacoes/Notificacoes.jsx"

export default function Notificacoes(){

        const notificacoes = [
    {id: 1, titulo: "Sua solicitação foi atualizada !", descricao: "A solicitação de buraco na Rua 7 agora está em andamento.", data: "Hoje, 14:22"},
    {id: 2, titulo: "Problema resolvido!", descricao: "A prefeitura concluiu o reparo na Av. Goiás.", data: "Ontem, 18:07"},
    {id: 3, titulo: "Aviso de manutenção", descricao: "Intervenção em via programada na sua região no dia 17/05, às 08h.", data: "14/05 às 09:00"},
    {id: 4, titulo: "Solicitação recusada", descricao: "Não foi possível confirmar o problema reportado.", data: "13/05 às 20:15"},
    {id: 5, titulo: "Agradecemos sua contribuição", descricao: "Obrigado por ajudar a melhorar sua cidade com o Arruma Aí!", data: "12/05 às 16:40"},
];

    return(
        <>
            <div>

                 <div className={estilos.container_topo}>
                    <h1>Notificações</h1>
                    <p>Acompanhe aqui as notificações recebidas</p>
                </div>

                <div className={estilos.container_main}>
                    <p className={estilos.mensagem_notificacao}>Lista de Notificações:</p>

                    {
                    notificacoes.length === 0 ? (
                        <div className={estilos.sem_notificacao}> 
                        <Image className={estilos.imagem_sem_notificacao} src={semNotificacao} alt="Não possui notificações"/>
                        <h2>Você ainda não recebeu nenhuma notificação</h2>
                        <p>Assim que algo acontecer, te avisamos por aqui!</p>
                        </div>
                    ) :
                        <div>
                        {notificacoes.map((n) => (
                        <CardNotificacoes key={n.id} titulo={n.titulo} descricao={n.descricao} data={n.data}/>
                    ))}
                    </div>
                }
                </div>

            </div>
        
                <Nav/>

        </>
    );
}