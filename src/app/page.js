import Image from "next/image";
import iconeFacilidade from "/public/tela-inicial/Icone-facilidade.png";
import melhoreSuaCidade from "/public/tela-inicial/ilustracao-melhore-sua-cidade.png";
import estilos from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
        <div className={estilos.container}>

            <div className={estilos.mensagemInicial}>
                <Image className={estilos.iconeFacilidade} src={iconeFacilidade} alt="Ícone de facilidade"/>
                <p>SIMPLES ASSIM !</p>
            </div>

            <div className={estilos.containerImagemMelhoreSuaCidade}>
                <Image className={estilos.imagemMelhoreSuaCidade} src={melhoreSuaCidade} />
            </div>

            <div className={estilos.containerMensagemFinal}>
                <div className={estilos.msg}>
                    <h2>Seja a mudança !</h2>
                    <p>Com um clique, você faz a diferença.</p>
                </div>

                <Link href="/logar"><button>Vamos começar ?</button></Link>
            </div>





        </div>

  );
}


