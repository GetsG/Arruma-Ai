'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";
import estilos from "./cardPerfil.module.css"

export default function CardPerfil(props) {
    const router = useRouter();

    function handleClick() {
        // Se vier uma função onClick, executa ela
        if (props.onClick) {
            props.onClick();
            return;
        }

        // Se vier caminho, navega normalmente
        if (props.caminho) {
            router.push(props.caminho);
        }
    }

    return (
        <button onClick={handleClick} className={estilos.container}>
            <Image src={props.image} alt={props.infoImage} />

            <div className={estilos.infos}>
                <h2>{props.titulo}</h2>
                <p className={estilos.p1}>{props.info}</p>
                <p className={estilos.p2}>{props.descricao}</p>
            </div>
        </button>
    );
}
