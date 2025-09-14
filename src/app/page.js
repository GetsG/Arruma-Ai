import Login from "@/componentes/Login/Login";
import Header from "@/componentes/Header/Header"
import estilos from "./page.module.css"

export default function Home() {
  return (
    <div className={estilos.container}>
      <Header />
      <Login />
    </div>
  );
}


