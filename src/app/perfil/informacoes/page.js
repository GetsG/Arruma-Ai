"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import estilos from "./informacoes.module.css";
import Carregando from "../../../componentes/Carregando/Carregando";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import { buscarDadosUsuario, getToken, limparSessao } from "../../../services/authService";

function Campo({ icone, label, valor }) {
  return (
    <div className={estilos.campo}>
      <span className={estilos.campoLabel}>
        <span className={estilos.campoIcone}>{icone}</span>
        {label}
      </span>
      <span className={estilos.campoValor}>{valor || "—"}</span>
    </div>
  );
}

export default function InformacoesUsuario() {
  const router = useRouter();
  const { carregando: authCarregando } = useRequireAuth();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (authCarregando) return;

    const token = getToken();
    buscarDadosUsuario(token)
      .then(setUsuario)
      .catch((err) => {
        if (err.message === "UNAUTHORIZED") {
          limparSessao();
          router.replace("/logar");
          return;
        }
        setErro("Não foi possível carregar seus dados.");
      })
      .finally(() => setCarregando(false));
  }, [authCarregando, router]);

  if (authCarregando || carregando) return <Carregando />;

  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className={estilos.pagina}>
      {/* CABEÇALHO VERDE */}
      <div className={estilos.topo}>
        <button className={estilos.voltar} onClick={() => router.back()}>
          ← Voltar
        </button>
        <h1 className={estilos.titulo}>Meu Perfil</h1>

        {/* AVATAR */}
        <div className={estilos.avatarWrapper}>
          <div className={estilos.avatar}>{inicial}</div>
          <p className={estilos.avatarNome}>{usuario?.nome}</p>
          <p className={estilos.avatarTipo}>
            {usuario?.tipo === "admin" ? "Administrador" : "Usuário"}
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className={estilos.conteudo}>
        {erro ? (
          <p className={estilos.erro}>{erro}</p>
        ) : (
          <>
            <div className={estilos.secao}>
              <p className={estilos.secaoTitulo}>Dados Pessoais</p>

              <div className={estilos.card}>
                <Campo icone="👤" label="Nome completo" valor={usuario?.nome} />
                <div className={estilos.divisor} />
                <Campo icone="📧" label="E-mail" valor={usuario?.email} />
                <div className={estilos.divisor} />
                <Campo icone="📱" label="Telefone" valor={usuario?.telefone} />
                <div className={estilos.divisor} />
                <Campo icone="📋" label="CPF" valor={usuario?.cpf} />
              </div>
            </div>

            {usuario?.tipo && (
              <div className={estilos.secao}>
                <p className={estilos.secaoTitulo}>Conta</p>
                <div className={estilos.card}>
                  <Campo
                    icone="🏷️"
                    label="Tipo de conta"
                    valor={usuario.tipo === "admin" ? "Administrador" : "Usuário"}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
