import Image from "next/image";
import iconeMais from "/public/home/+.png";
import agua from "/public/home/gota.png";
import atencao from "/public/home/atencao.png";
import rua from "/public/home/rua.png";
import estilos from "./home.module.css";

export default function Home(){
    return(

        <div className={estilos.container}>
            <div className={estilos.container_topo}>
                <div className={estilos.mensagem_inicio}>
                    <h1>Oi ...!</h1>
                    <p>Que tal ajudar a melhorar sua cidade agora?</p>
                </div>
                <button> <Image src={iconeMais}/>Criar nova solicitação</button>
            </div>

            <div className={estilos.container_main}>
                <p className={estilos.mensagem_aviso}>Avisos para a comunidade</p>

                <button>
                    <Image src={agua} />
                        <div className={estilos.conteudo}>
                            <h2>Manutenções programadas proximas a você</h2>
                            <p>Clique aqui para mais informações</p>
                        </div>
                </button>

                <button>
                    <Image src={atencao} />
                        <div className={estilos.conteudo}>
                            <h2>Previsão de chuva fortes e possiveis alagamentos</h2>
                            <p>Clique aqui para mais informações</p>
                        </div>
                </button>

                <button>
                    <Image src={rua} />
                        <div className={estilos.conteudo}>
                            <h2>Manutenções programadas proximas a você</h2>
                            <p>Clique aqui para mais informações</p>
                        </div>
                </button>
            </div>


        </div>
    );
}