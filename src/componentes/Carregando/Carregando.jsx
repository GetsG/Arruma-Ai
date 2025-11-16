import estilos from "./carregando.module.css"

export default function Carregando(){
    return(
         <div className={estilos.loadingWrapper}>
    <div className={estilos.loader}></div>
        <p>Carregando...</p>
    </div>
    );
}