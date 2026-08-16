"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import estilos from "./ocorrencias.module.css";
import Nav from "../../componentes/Nav/Nav.jsx";
import CardOcorrencia from "../../componentes/CardOcorrencias/Ocorrencia.jsx";
import mapa from "../../../public/ocorrencias/mapa.png";
import mais from "../../../public/ocorrencias/mais.png";
import Image from "next/image";
import Carregando from "../../componentes/Carregando/Carregando";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { listarProblemas } from "../../services/problemService";
import { getToken } from "../../services/authService";

export default function Ocorrencias() {
  const router = useRouter();
  const { carregando: authCarregando } = useRequireAuth();

  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(false);

  useEffect(() => {
    if (authCarregando) return;

    const token = getToken();
    setCarregandoDados(true);

    listarProblemas(token)
      .then(setOcorrencias)
      .catch((err) => {
        if (err.message === "UNAUTHORIZED") {
          router.replace("/logar");
          return;
        }
        setOcorrencias([]);
        console.error("Erro ao buscar problemas:", err);
      })
      .finally(() => setCarregandoDados(false));
  }, [authCarregando, router]);

  if (authCarregando || carregandoDados) {
    return <Carregando />;
  }

  return (
    <>
      <div className={estilos.container}>
        <div className={estilos.container_topo}>
          <h1>Minhas Solicitações</h1>
          <p>Acompanhe aqui os problemas que já reportou</p>
        </div>

        <div className={estilos.container_main}>
          <p className={estilos.mensagem_solicitacao}>Solicitações enviadas :</p>

          {ocorrencias.length === 0 ? (
            <div className={estilos.sem_solicitacao}>
              <Image
                className={estilos.imagem_sem_solicitacao}
                src={mapa}
                alt="Não possui solicitações"
              />
              <h2>Você ainda não fez nenhuma solicitação</h2>
              <p>Que tal começar agora?</p>

              <button
                className={estilos.cadastrar_solicitacao}
                onClick={() => router.push("/cadastrar_ocorrencia")}
              >
                <Image src={mais} alt="Cadastrar nova solicitação" />
                Criar nova solicitação
              </button>
            </div>
          ) : (
            <div>
              {ocorrencias.map((o) => (
                <CardOcorrencia
                  key={o.id}
                  id={o.id}
                  data={o.data}
                  descricao={o.descricao}
                  tipo={o.categoria}
                  rua={o.rua}
                  pontoReferencia={o.pontoReferencia}
                  status={o.status}
                  image={o.imagem}
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
