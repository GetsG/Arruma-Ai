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

export default function Ocorrencias() {
  const router = useRouter();

  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarOcorrencias() {
      const token = localStorage.getItem("arrumaai_token");

      // se não tiver token, manda pro login
      if (!token) {
        router.replace("/logar");
        return;
      }

      try {
        const res = await fetch(
          "https://arruma-ai-api.onrender.com/problem",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        // se o token for inválido / expirado
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("arrumaai_token");
          localStorage.removeItem("arrumaai_userId");
          router.replace("/logar");
          return;
        }

        const body = await res.json();
        console.log("RESPOSTA GET /problems:", body);

        if (body.success && Array.isArray(body.data)) {
          // adapta o formato pra usar no CardOcorrencia
          const listaAdaptada = body.data.map((p) => ({
            id: p.problemaid,
            data: p.data,
            descricao: p.descricao,
            categoria: p.categoria,
            bairro: p.bairro || "-",
            status: p.status,
          }));

          setOcorrencias(listaAdaptada);
        } else {
          setOcorrencias([]);
        }
      } catch (err) {
        console.error("Erro ao buscar /problems:", err);
        setOcorrencias([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarOcorrencias();
  }, [router]);

  if (carregando) {
    return (
      <>
    <Carregando/>
</>
    );
  }

  return (
    <>
      <div className={estilos.container}>
        <div className={estilos.container_topo}>
          <h1>Minhas Solicitações</h1>
          <p>Acompanhe aqui os problemas que já reportou</p>
        </div>

        <div className={estilos.container_main}>
          <p className={estilos.mensagem_solicitacao}>
            Solicitações enviadas :
          </p>

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
                  tipo={o.categoria}
                  bairro={o.bairro}
                  status={o.status}
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
