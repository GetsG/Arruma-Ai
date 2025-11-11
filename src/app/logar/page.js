'use client';
import { useRouter } from 'next/navigation';
import estilos from "./logar.module.css"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import Header from '../../componentes/Header/Header';

export default function Logar() {

    const router = useRouter();

    const handleClick = () => {
    router.push('/home'); // muda para a rota /home
  };

  return (

    <>

    <Header/>

      <div className={estilos.container}>

            <h1 className={estilos.titulo}>Entrar</h1>

            <div className={estilos.component_acesso}>

                <div className={estilos.component_infos}>
                    <div>
                        <p>E-mail:</p>
                        <input></input>
                    </div>
                    <div>
                        <p>Senha:</p>
                        <input type="password"></input>
                    </div>    
                </div>
                
                <div className={estilos.component_links}>
                    <a className={estilos.recuperar_senha} href="#">Esqueci a senha</a>
                    <span className={estilos.separator}>|</span>
                    <Link href="/registrar" className={estilos.criar_conta}>Criar conta</Link>
                </div>

               <button onClick={handleClick} className={estilos.acessar}>Entrar</button>
            </div>
    <hr/>

            <div className={estilos.tipos_acessos}>
                <button><FcGoogle className={estilos.logos}/> Continue com Google</button>
                <button><FaApple className={estilos.logos}/> Continue com Apple</button>
            </div>

        </div>
    </>

  );
}


