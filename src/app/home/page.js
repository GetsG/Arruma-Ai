"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Image from "next/image";
import iconeMais from "/public/home/+.png";
import agua from "/public/home/gota.png";
import atencao from "/public/home/atencao.png";
import rua from "/public/home/rua.png";
import estilos from "./home.module.css";
import Nav from "../../componentes/Nav/Nav.jsx";
import Carregando from "../../componentes/Carregando/Carregando.jsx"

export default function Home() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState("");

  function criarSolicitacao() {
    router.push("/cadastrar_ocorrencia");
  }

  useEffect(() => {
    const token = localStorage.getItem("arrumaai_token");

    if (!token) {
      router.replace("/logar");
      return;
    }

    const nomeSalvo = localStorage.getItem("arrumaai_nome") || "";
    setNome(nomeSalvo);

    setCarregando(false);
  }, [router]);

  if (carregando) {
    return <Carregando/>;
  }

  return (
    <>
      <div className={estilos.container}>
        <div className={estilos.container_topo}>
          <div className={estilos.mensagem_inicio}>
            <h1>Oi, {nome || "..."}!</h1>
            <p>Que tal ajudar a melhorar sua cidade agora?</p>
          </div>
          <button onClick={criarSolicitacao}>
            <Image
              src={iconeMais}
              alt="Icone mais para criar uma solicitação"
            />
            Criar nova solicitação
          </button>
        </div>

        <div className={estilos.container_main}>
          <p className={estilos.mensagem_aviso}>Avisos para a comunidade</p>

          <button>
            <Image
              className={estilos.icones}
              src={agua}
              alt="Ícone de gota d’água indicando manutenção próxima"
            />
            <div className={estilos.conteudo}>
              <h2>Manutenções programadas próximas a você</h2>
              <p>Clique aqui para mais informações</p>
            </div>
          </button>

          <button>
            <Image
              className={estilos.icones}
              src={atencao}
              alt="Ícone de alerta amarelo indicando previsão de chuvas fortes"
            />
            <div className={estilos.conteudo}>
              <h2>Previsão de chuvas fortes e possíveis alagamentos</h2>
              <p>Clique aqui para mais informações</p>
            </div>
          </button>

          <button>
            <Image
              className={estilos.icones}
              src={rua}
              alt="Ícone de estrada indicando manutenção em ruas próximas"
            />
            <div className={estilos.conteudo}>
              <h2>Manutenções programadas próximas a você</h2>
              <p>Clique aqui para mais informações</p>
            </div>
          </button>
        </div>
      </div>

      <Nav />
    </>
  );
}
