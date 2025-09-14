import Header from '@/componentes/Header/Header'
import Cadastro from '@/componentes/Login/Cadastro'
import estilos from './registrar.module.css'

export default function Registrar() {
  return (
    <div className={estilos.container}>
      <Header />
      <Cadastro />
    </div>

);
}