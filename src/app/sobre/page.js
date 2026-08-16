"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo/Logo.png";
import estilos from "./sobre.module.css";

const PASSOS = [
  { num: "1", titulo: "Identifique o problema", desc: "Encontrou algo que precisa ser resolvido na cidade? Pode ser um buraco, falta de iluminação, problema no saneamento..." },
  { num: "2", titulo: "Marque no mapa", desc: "Aponte o local exato do problema no mapa interativo para facilitar o atendimento pela equipe responsável." },
  { num: "3", titulo: "Envie sua solicitação", desc: "Adicione uma descrição e foto do problema e envie. Simples assim!" },
  { num: "4", titulo: "Acompanhe o status", desc: "Receba atualizações e acompanhe o progresso da sua solicitação em tempo real." },
];

const CATEGORIAS = [
  { emoji: "🏗️", nome: "Infraestrutura" },
  { emoji: "💡", nome: "Iluminação Pública" },
  { emoji: "💧", nome: "Saneamento" },
  { emoji: "🚨", nome: "Segurança" },
  { emoji: "🚌", nome: "Transporte" },
];

export default function SobreOApp() {
  const router = useRouter();

  return (
    <div className={estilos.pagina}>
      {/* TOPO */}
      <div className={estilos.topo}>
        <button className={estilos.voltar} onClick={() => router.back()}>
          ← Voltar
        </button>

        <div className={estilos.logoBox}>
          <div className={estilos.logoIcone}>
            <Image src={logo} alt="Logo Arruma Aí" fill style={{ objectFit: "contain" }} />
          </div>
          <h1 className={estilos.logoNome}>Arruma Aí</h1>
          <p className={estilos.logoVersao}>Versão 1.0.0</p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className={estilos.conteudo}>

        {/* O QUE É */}
        <div className={estilos.card}>
          <h2 className={estilos.cardTitulo}>O que é o Arruma Aí?</h2>
          <p className={estilos.cardTexto}>
            O <strong>Arruma Aí</strong> é um sistema de reporte cívico criado para aproximar os
            cidadãos da gestão pública. Por meio do app, qualquer pessoa pode
            identificar e reportar problemas urbanos diretamente para os órgãos responsáveis da sua cidade.
          </p>
        </div>

        {/* COMO FUNCIONA */}
        <div className={estilos.card}>
          <h2 className={estilos.cardTitulo}>Como funciona?</h2>
          <div className={estilos.passos}>
            {PASSOS.map((p) => (
              <div key={p.num} className={estilos.passo}>
                <div className={estilos.passoNum}>{p.num}</div>
                <div>
                  <p className={estilos.passoTitulo}>{p.titulo}</p>
                  <p className={estilos.passoDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIAS */}
        <div className={estilos.card}>
          <h2 className={estilos.cardTitulo}>Categorias disponíveis</h2>
          <div className={estilos.categorias}>
            {CATEGORIAS.map((c) => (
              <div key={c.nome} className={estilos.categoriaPill}>
                <span>{c.emoji}</span>
                <span>{c.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MISSÃO */}
        <div className={estilos.cardDestaque}>
          <p className={estilos.missaoIcone}>🌱</p>
          <p className={estilos.missaoTexto}>
            Nossa missão é construir uma cidade mais organizada, segura e acolhedora para todos.
          </p>
        </div>

        <p className={estilos.rodape}>Desenvolvido como Trabalho de Conclusão de Curso</p>
      </div>
    </div>
  );
}
