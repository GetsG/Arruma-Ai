"use client";

import estilos from "./notificacoes.module.css";
import semNotificacao from "../../../public/notificacoes/semNotificacao.png";
import Image from "next/image";
import Nav from "../../componentes/Nav/Nav.jsx";
import CardNotificacoes from "../../componentes/CardNotificacoes/Notificacoes.jsx";
import Carregando from "../../componentes/Carregando/Carregando";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { MOCK_NOTIFICACOES } from "../../data/mockNotificacoes";

export default function Notificacoes() {
  const { carregando } = useRequireAuth();

  if (carregando) {
    return <Carregando />;
  }

  const notificacoes = MOCK_NOTIFICACOES;

  return (
    <>
      <div>
        <div className={estilos.container_topo}>
          <h1>Notificações</h1>
          <p>Acompanhe aqui as notificações recebidas</p>
        </div>

        <div className={estilos.container_main}>
          <p className={estilos.mensagem_notificacao}>Lista de Notificações:</p>

          {notificacoes.length === 0 ? (
            <div className={estilos.sem_notificacao}>
              <Image
                className={estilos.imagem_sem_notificacao}
                src={semNotificacao}
                alt="Não possui notificações"
              />
              <h2>Você ainda não recebeu nenhuma notificação</h2>
              <p>Assim que algo acontecer, te avisamos por aqui!</p>
            </div>
          ) : (
            <div>
              {notificacoes.map((n) => (
                <CardNotificacoes
                  key={n.id}
                  titulo={n.titulo}
                  descricao={n.descricao}
                  data={n.data}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Nav />
    </>
  );
}
