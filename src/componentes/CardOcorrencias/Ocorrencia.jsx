import estilos from "./ocorrencia.module.css";
import Image from "next/image";

import pendente from "./Icones/pendente.png";
import emAndamento from "./Icones/emAndamento.png";
import resolvido from "./Icones/resolvido.png";

export default function Ocorrencia({ id, data, tipo, rua, status, image }) {
  const iconeStatus =
    status === "Pendente"
      ? pendente
      : status === "Em andamento"
      ? emAndamento
      : resolvido;

  return (
    <div className={estilos.container}>
      <div className={estilos.infos}>
        <p>
          <strong>Protocolo: #{id}</strong>
        </p>
        <p>
          <strong>Última atualização:</strong> {data}
        </p>
        <p>
          <strong>Tipo:</strong> {tipo}
        </p>
        <p>
          <strong>Rua:</strong> {rua}
        </p>

        <div className={estilos.status}>
          <p>
            <strong>Status:</strong> {status}
          </p>
          <Image
            className={estilos.imagemStatus}
            src={iconeStatus}
            alt="Status da ocorrência"
          />
        </div>
      </div>

      <div className={estilos.detalhes}>
        {image ? (
          <Image
            className={estilos.img}
            src={image}                // data:image/jpeg;base64,...
            alt="Imagem da ocorrência"
            width={120}               // coloca um tamanho fixo ou o que quiser
            height={120}
            unoptimized               // evita tentar otimizar (pra data URL)
          />
        ) : (
          <div className={estilos.semImagem}>Sem imagem</div>
        )}

      </div>
    </div>
  );
}
