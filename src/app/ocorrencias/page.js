'use client'
import estilos from "./ocorrencias.module.css"
import Nav from "../../componentes/Nav/Nav.jsx"
import {useState} from "react"

export default function Ocorrencias(){

const [categoria, setCategoria] = useState("");
const [descricao, setDescricao] = useState("");
const [imagem, setImagem] = useState(null);
const [intensidade, setIntensidade] = useState("");

const [cep, setCep] = useState("");
const [logradouro, setLogradouro] = useState("");
const [complemento, setComplemento] = useState("");
const [bairro, setBairro] = useState("");
const [cidade, setCidade] = useState("");
const [estado, setEstado] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0]; // pega a primeira imagem escolhida
    setImagem(file);
  }


    return(
        <>
        <div className={estilos.container}>
            <div className={estilos.container_topo}>
                <h1>Vamos criar uma nova solicitação ?</h1>
                <p>Preencha os campos a seguir</p>
            </div>

             <div className={estilos.container_main}>
                <p className={estilos.mensagem_aviso}>Preencha com seu relato ou denuncia</p>


                    <form>
                        <div className={estilos.categoria}>
                            <h2>Categoria</h2>
                            <div className={estilos.categoria_opcoes}>
                                <input 
                                placeholder="Escolha a categoria da sua solicitação"
                                value={categoria}/>
                                <label htmlFor="categoria">
                                    <select id="categoria" onChange={(e) => setCategoria(e.target.value)}> aa
                                        <option></option>
                                        <option value="Buraco na Via">Buraco na Via</option>
                                        <option value="iluminação Pública">Iluminação pública</option>
                                        <option value="Semáforo">Semáforo</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div className={estilos.conteudo}>
                            <h2>Descrição</h2>
                            <label htmlFor="descricao">
                                <input id="nome" 
                                type="text" 
                                placeholder="Preencha com o seu relato ou denuncia"
                                onChange={(e) => setDescricao(e.target.value)}/>
                            </label>
                        </div>

                        <div className={estilos.conteudo}>
                            <h2>Imagem :</h2>

                            <label htmlFor="imagem">
                                Anexar Imagem 
                            </label>

                                <input 
                                id="imagem" 
                                type="file" 
                                onChange={handleFileChange}
                                style={{ display: "none" }}/>
                            
                            {imagem && (
                                <img
                                src={URL.createObjectURL(imagem)}
                                alt="Prévia da imagem"
                                width={200}/>
                            )}
                        </div>

                        <div className={estilos.conteudo}>
                            <h2>Grau de intensidade :</h2>
                            <p>Escolha com sinceridade o grau de intensidade da solicitação</p>
                            <label htmlFor="grauIntensidade">
                                <select id="grauIntensidade" onChange={(e) => setIntensidade(e.target.value)}>
                                    <option value="nenhum"></option>
                                    <option value="baixa">Baixa</option>
                                    <option value="moderada">Moderada</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </label>
                        </div>

                        <div className={estilos.conteudo}>
                            <h2>Endereço</h2>

                            <button>Marcar local no mapa</button>

                            <label htmlFor="cep"> CEP :
                                <input id="cep" 
                                type="text" 
                                onChange={(e) => setCep(e.target.value)}/>
                            </label>

                            <label htmlFor="logradouro"> Logradouro :
                                <input id="logradouro" 
                                type="text" 
                                onChange={(e) => setLogradouro(e.target.value)}/>
                            </label>

                            <label htmlFor="complemento"> Complemento :
                                <input id="complemento" 
                                type="text" 
                                onChange={(e) => setComplemento(e.target.value)}/>
                            </label>

                            <label htmlFor="bairro"> Bairro :
                                <input id="bairro" 
                                type="text" 
                                onChange={(e) => setBairro(e.target.value)}/>
                            </label>

                            <label htmlFor="cidade"> Cidade :
                                <input id="cidade" 
                                type="text" 
                                onChange={(e) => setCidade(e.target.value)}/>
                            </label>

                            <label htmlFor="estado"> Estado :
                                <input id="estado" 
                                type="text" 
                                onChange={(e) => setEstado(e.target.value)}/>
                            </label>
                        </div>

                            <button>Enviar Solicitação</button>

                    </form>
            </div>
        </div>

        <Nav/>

        </>
    );
}