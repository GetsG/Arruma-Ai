"use client";

import { useRouter } from "next/navigation";

import estilos from "./perfil.module.css";
import Nav from "../../componentes/Nav/Nav";
import CardPerfil from "../../componentes/OpcoesPerfil/CardPerfil.jsx";
import Carregando from "../../componentes/Carregando/Carregando";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { logout } from "../../services/authService";

import info from "../../../public/perfil/infoUsuario.png";
import sobre from "../../../public/perfil/sobre.png";
import encerrar from "../../../public/perfil/encerrar.png";

export default function Perfil() {
  const router = useRouter();
  const { carregando } = useRequireAuth();

  function handleLogout() {
    logout();
    router.replace("/logar");
  }

  if (carregando) {
    return <Carregando />;
  }

  return (
    <>
      <div className={estilos.container}>
        <div className={estilos.container_topo}>
          <h1>Seu Perfil</h1>
          <p>Gerencie suas informações e preferencias com facilidade</p>
        </div>

        <div className={estilos.opcoes}>
          <p className={estilos.msgLista}>Configurações</p>

          <CardPerfil
            caminho={"/perfil/informacoes"}
            image={info}
            infoImage={"Informações do Usuário"}
            titulo={"Informações do Usuário"}
            info={"Seus Dados"}
            descricao={"Veja suas informações pessoais."}
          />

          <CardPerfil
            caminho={"/sobre"}
            image={sobre}
            infoImage={"Sobre o App"}
            titulo={"Sobre o App"}
            info={"Informações do App"}
            descricao={"Saiba como o Arruma Aí funciona."}
          />

          <CardPerfil
            onClick={handleLogout}
            image={encerrar}
            infoImage={"Encerramento da Sessão"}
            titulo={"Encerramento da Sessão"}
            info={"Sessão e Conta"}
            descricao={"Finalize sua sessão."}
          />
        </div>
      </div>

      <Nav />
    </>
  );
}
