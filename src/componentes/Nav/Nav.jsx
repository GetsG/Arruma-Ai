import Link from "next/link";
import Image from "next/image";

import Home from "./Icones/Home.png";
import Criar from "./Icones/Criar.png";
import Pasta from "./Icones/Pasta.png";
import Sino from "./Icones/Sino.png";
import Perfil from "./Icones/Perfil.png";

import estilos from "./Nav.module.css";

export default function Nav(){
    return(
        <footer className={estilos.nav}>
            <nav>
                <Link href="/home"> <Image className={estilos.icone} src={Home} alt="Ícone de casa, botão para página inicial"/> </Link>
                <Link href="/cadastrar_ocorrencia"> <Image className={estilos.icone} src={Criar} alt="Ícone de mais, botão para criar nova solicitação"/> </Link>
                <Link href="/ocorrencias"> <Image className={estilos.icone} src={Pasta} alt="Ícone de pasta, botão para visualizar solicitações"/> </Link>
                <Link href="#"> <Image className={estilos.icone} src={Sino} alt="Ícone de sino, botão para notificações"/> </Link>
                <Link href="#"> <Image className={estilos.icone} src={Perfil} alt="Ícone de perfil, botão para acessar conta do usuário"/> </Link>
            </nav>
        </footer>
    );
}