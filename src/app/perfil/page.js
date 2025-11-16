"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import estilos from "./perfil.module.css";
import Nav from "../../componentes/Nav/Nav";
import CardPerfil from "../../componentes/OpcoesPerfil/CardPerfil.jsx";

import info from "../../../public/perfil/infoUsuario.png";
import preferencia from "../../../public/perfil/preferencias.png";
import privacidade from "../../../public/perfil/privacidade.png";
import sobre from "../../../public/perfil/sobre.png";
import encerrar from "../../../public/perfil/encerrar.png";
import Carregando from "../../componentes/Carregando/Carregando";

export default function Perfil() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("arrumaai_token");

    // se não tiver token, manda pro login
    if (!token) {
      router.replace("/logar");
      return;
    }

    setCarregando(false);
  }, [router]);

  if (carregando) {
    return (
          <Carregando/>
    );
  }

  return (
    <>
      <div className={estilos.container}>
        <div className={estilos.container_topo}>
          <h1>Seu Perfil</h1>
          <p>Gerencie suas informações e preferencias com facilidade</p>
        </div>

        <div className={estilos.opcoes}>
          <p className={estilos.msgLista}>Lista de Notificações :</p>

          <CardPerfil
            caminho={"#"}
            image={info}
            infoImage={"Informações do Usuário"}
            titulo={"Informações do Usuário"}
            info={"Seus Dados"}
            descricao={"Veja e atualize suas informações pessoais."}
          />

          <CardPerfil
            caminho={"#"}
            image={preferencia}
            infoImage={"Preferências do Aplicativo"}
            titulo={"Preferências do Aplicativo"}
            info={"Suas Preferências"}
            descricao={"Personalize o app do jeito que você quiser."}
          />

          <CardPerfil
            caminho={"#"}
            image={privacidade}
            infoImage={"Privacidade e Segurança"}
            titulo={"Privacidade e Segurança"}
            info={"Segurança da Conta"}
            descricao={"Gerencie sua senha e veja as políticas do app."}
          />

          <CardPerfil
            caminho={"#"}
            image={sobre}
            infoImage={"Sobre o App"}
            titulo={"Sobre o App"}
            info={"Informações do App"}
            descricao={"Saiba mais sobre a versão, suporte e ajuda."}
          />

          <CardPerfil
            caminho={"/logar"}
            image={encerrar}
            infoImage={"Encerramento da Sessão"}
            titulo={"Encerramento da Sessão"}
            info={"Sessão e Conta"}
            descricao={"Finalize sua sessão ou exclua sua conta."}
          />
        </div>
      </div>

      <Nav />
    </>
  );
}
