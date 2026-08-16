"use client";

import { useRouter } from "next/navigation";
import estilos from "./termos.module.css";

const SECOES = [
  {
    titulo: "1. Aceitação dos Termos",
    texto: `Ao criar uma conta e utilizar o aplicativo Arruma Aí, você declara que leu, compreendeu e concorda com estes Termos de Uso. Caso não concorde com qualquer disposição aqui presente, não utilize o aplicativo.`,
  },
  {
    titulo: "2. Sobre o Arruma Aí",
    texto: `O Arruma Aí é uma plataforma de reporte cívico que permite aos cidadãos identificar, fotografar e registrar problemas urbanos em sua cidade, encaminhando as solicitações aos órgãos públicos responsáveis. O sistema não substitui canais oficiais de atendimento e não garante prazo de resolução dos problemas reportados, pois isso depende exclusivamente dos órgãos competentes.`,
  },
  {
    titulo: "3. Cadastro e Responsabilidade da Conta",
    texto: `Para utilizar o aplicativo, você deve criar uma conta com informações verdadeiras, precisas e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta. Em caso de uso não autorizado, notifique-nos imediatamente. É vedado criar contas com dados falsos, de terceiros ou com a intenção de prejudicar outros usuários.`,
  },
  {
    titulo: "4. Uso Adequado da Plataforma",
    texto: `Ao utilizar o Arruma Aí, você se compromete a:\n\n• Reportar apenas problemas urbanos reais e verificáveis;\n• Inserir informações precisas sobre localização e descrição do problema;\n• Enviar somente imagens relacionadas ao problema reportado;\n• Não utilizar o aplicativo para fins comerciais, políticos ou de assédio;\n• Não publicar conteúdo ofensivo, discriminatório, ilegal ou que viole direitos de terceiros;\n• Não tentar comprometer a segurança, disponibilidade ou integridade da plataforma.`,
  },
  {
    titulo: "5. Conteúdo Enviado pelo Usuário",
    texto: `Ao enviar descrições, fotos e informações de localização, você declara que:\n\n• É o autor ou possui os direitos sobre o conteúdo enviado;\n• O conteúdo não viola leis, regulamentos ou direitos de terceiros;\n• Concede ao Arruma Aí uma licença não exclusiva para armazenar, exibir e utilizar o conteúdo enviado exclusivamente para a operação do serviço e encaminhamento às autoridades competentes.\n\nO aplicativo não se responsabiliza pelo conteúdo enviado pelos usuários.`,
  },
  {
    titulo: "6. Privacidade e Proteção de Dados",
    texto: `O Arruma Aí coleta e trata dados pessoais (nome, e-mail, CPF, telefone e localização) estritamente para o funcionamento do serviço e encaminhamento das solicitações. Seus dados não serão vendidos a terceiros. O tratamento de dados segue os princípios da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato conosco.`,
  },
  {
    titulo: "7. Limitação de Responsabilidade",
    texto: `O Arruma Aí atua como intermediário entre cidadãos e órgãos públicos, não tendo controle sobre as ações ou omissões destes. Portanto, não nos responsabilizamos por:\n\n• Prazo ou qualidade na resolução dos problemas reportados;\n• Decisões tomadas pelos órgãos públicos;\n• Falhas temporárias de disponibilidade do aplicativo;\n• Danos indiretos decorrentes do uso ou incapacidade de uso da plataforma.`,
  },
  {
    titulo: "8. Suspensão e Encerramento de Conta",
    texto: `Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos de Uso, sem aviso prévio, em casos como: envio de informações falsas, uso abusivo da plataforma, tentativas de fraude ou qualquer conduta que comprometa a integridade do serviço ou de outros usuários.`,
  },
  {
    titulo: "9. Alterações nos Termos",
    texto: `Estes Termos de Uso podem ser atualizados periodicamente. Notificaremos os usuários sobre alterações relevantes. O uso continuado do aplicativo após a publicação de novos termos implica na aceitação das mudanças. Recomendamos que você revise estes termos periodicamente.`,
  },
  {
    titulo: "10. Disposições Gerais",
    texto: `Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer litígio decorrente da utilização do aplicativo será submetido ao foro da comarca competente, com renúncia expressa a qualquer outro. Caso alguma disposição destes termos seja considerada inválida, as demais permanecerão em pleno vigor.`,
  },
];

export default function TermosDeUso() {
  const router = useRouter();

  return (
    <div className={estilos.pagina}>

      {/* CABEÇALHO */}
      <div className={estilos.topo}>
        <button className={estilos.voltar} onClick={() => router.back()}>
          ← Voltar
        </button>
        <h1 className={estilos.titulo}>Termos de Uso</h1>
        <p className={estilos.subtitulo}>Última atualização: junho de 2025</p>
      </div>

      {/* CONTEÚDO */}
      <div className={estilos.conteudo}>

        <div className={estilos.intro}>
          <p>
            Bem-vindo ao <strong>Arruma Aí</strong>. Leia atentamente os termos abaixo antes de
            criar sua conta. Eles definem seus direitos e responsabilidades ao utilizar nossa plataforma.
          </p>
        </div>

        {SECOES.map((s) => (
          <div key={s.titulo} className={estilos.secao}>
            <h2 className={estilos.secaoTitulo}>{s.titulo}</h2>
            <p className={estilos.secaoTexto}>{s.texto}</p>
          </div>
        ))}

        <div className={estilos.rodape}>
          <p>Dúvidas? Entre em contato pelo e-mail <strong>contato@arrumaai.com.br</strong></p>
        </div>

      </div>
    </div>
  );
}
