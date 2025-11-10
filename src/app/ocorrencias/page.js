import estilos from "./ocorrencias.module.css";
import Ocorrencia from "@/componentes/Ocorrencias/Ocorrencia";

export default function Ocorrencias() {

      const ocorrencias = [
    { id: 1001, titulo: "Buraco na rua", categoria: "Manutenção", status: "Aberto" },
    { id: 1002, titulo: "Luz piscando", categoria: "Elétrico", status: "Aberto" },
    { id: 1003, titulo: "Vazamento de água", categoria: "Manutenção", status: "Fechado" },
  ];

    return(
        <div className={estilos.container}>

            <div className={estilos.cadastroOcorrencia}>
                <h1>Ocorrências</h1>
                <button>+ Cadastrar Ocorrência</button>
            </div>

            <table className={estilos.tabela}>

                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                    </tr>
                </thead>

        <tbody>
          {ocorrencias.map((o) => (
            <Ocorrencia key={o.id} descricao={o.titulo} categoria={o.categoria} status={o.status}/>
          ))}
        </tbody>

            </table>



        </div>
    );
}