import estilos from "./ocorrencia.module.css";

const CATEGORIA_CONFIG = {
  "Infraestrutura":     { emoji: "🏗️", cor: "#ea580c", bg: "#fff4ee" },
  "Iluminação Pública": { emoji: "💡", cor: "#b45309", bg: "#fefce8" },
  "Saneamento":         { emoji: "💧", cor: "#0369a1", bg: "#f0f9ff" },
  "Segurança":          { emoji: "🚨", cor: "#dc2626", bg: "#fff1f1" },
  "Transporte":         { emoji: "🚌", cor: "#7c3aed", bg: "#f5f3ff" },
};

const STATUS_CONFIG = {
  "Pendente":     { cor: "#d97706", bg: "#fef3c7", dotBg: "#d97706" },
  "Em andamento": { cor: "#2563eb", bg: "#dbeafe", dotBg: "#2563eb" },
  "Resolvido":    { cor: "#16a34a", bg: "#dcfce7", dotBg: "#16a34a" },
  "Em analise":   { cor: "#7c3aed", bg: "#f5f3ff", dotBg: "#7c3aed" },
  "Atribuido":    { cor: "#0891b2", bg: "#ecfeff", dotBg: "#0891b2" },
  "Cancelado":    { cor: "#6b7280", bg: "#f3f4f6", dotBg: "#6b7280" },
};

export default function Ocorrencia({ id, data, descricao, tipo, rua, pontoReferencia, status, image }) {
  const cat = CATEGORIA_CONFIG[tipo] || { emoji: "📋", cor: "#2F9D53", bg: "#e8f5ed" };
  const st  = STATUS_CONFIG[status]  || { cor: "#6b7280", bg: "#f3f4f6", dotBg: "#6b7280" };

  return (
    <div className={estilos.card}>

      {/* IMAGEM */}
      {image ? (
        <div className={estilos.banner}>
          <img src={image} alt="Imagem da ocorrência" />
        </div>
      ) : (
        <div className={estilos.bannerVazio}>
          <span>📷</span>
          <p>Sem imagem</p>
        </div>
      )}

      <div className={estilos.corpo}>

        {/* CATEGORIA + STATUS */}
        <div className={estilos.badges}>
          <span className={estilos.categoriaBadge} style={{ color: cat.cor, background: cat.bg }}>
            {cat.emoji} {tipo}
          </span>
          <span className={estilos.statusBadge} style={{ color: st.cor, background: st.bg }}>
            <span className={estilos.statusDot} style={{ background: st.dotBg }} />
            {status}
          </span>
        </div>

        {/* PROTOCOLO */}
        <p className={estilos.protocolo}>Protocolo #{id}</p>

        {/* DESCRIÇÃO */}
        {descricao && (
          <>
            <div className={estilos.separador} />
            <p className={estilos.descricao}>{descricao}</p>
          </>
        )}

        <div className={estilos.separador} />

        {/* LOCALIZAÇÃO */}
        {(rua || pontoReferencia) && (
          <div className={estilos.infoBloco}>
            <span className={estilos.infoIcone}>📍</span>
            <div>
              {rua && <p className={estilos.infoTexto}>{rua}</p>}
              {pontoReferencia && <p className={estilos.infoSub}>{pontoReferencia}</p>}
            </div>
          </div>
        )}

        {/* DATA */}
        {data && (
          <div className={estilos.infoBloco}>
            <span className={estilos.infoIcone}>📅</span>
            <p className={estilos.infoTexto}>{data}</p>
          </div>
        )}

      </div>
    </div>
  );
}
