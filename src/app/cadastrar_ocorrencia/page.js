'use client'
import estilos from "./ocorrencias.module.css"
import Nav from "../../componentes/Nav/Nav.jsx"
import {useState} from "react"
import MapaModal from "../../componentes/MapaModal/MapaModal.jsx";

export default function Ocorrencias(){

const [showMapa, setShowMapa] = useState(false);

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

  function handleEnderecoSelecionado(end) {
  setCep(end.cep);
  setLogradouro(end.logradouro);
  setComplemento(end.numero);
  setBairro(end.bairro);
  setCidade(end.cidade);
  setEstado(end.estado);
}

function handleSubmit(e) {
    e.preventDefault(); // impede reload
    // aqui você trata o envio da solicitação
    console.log({
      categoria,
      descricao,
      intensidade,
      cep,
      logradouro,
      complemento,
      bairro,
      cidade,
      estado,
    });
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


                    <form onSubmit={handleSubmit}>

                        {/* CATEGORIA */}
                        <div className={estilos.categoria}>
                            <h2>Categoria</h2>
                            <div className={estilos.categoria_opcoes}>
                                   <p className={estilos.mensagem_categoria}>Escolha a categoria da sua solicitação</p> 
                                <label htmlFor="categoria">
                                    <select id="categoria" onChange={(e) => setCategoria(e.target.value)}> aa
                                        <option></option>
                                        <option value="Buraco na Via">Buraco na Via</option>
                                        <option value="Iluminação Pública">Iluminação pública</option>
                                        <option value="Semáforo">Semáforo</option>
                                    </select>
                                </label>
                            </div>
                                <p className={estilos.mostrar_categoria}>{categoria}</p> 
                        </div>
                        {/*--------------------------------*/}


                        {/* DESCRIÇÃO */}
                        <div className={estilos.descricao}>
                            <h2>Descrição</h2>
                            <label htmlFor="descricao">
                                <input id="nome" 
                                type="text" 
                                placeholder="Preencha com o seu relato ou denuncia"
                                onChange={(e) => setDescricao(e.target.value)}/>
                            </label>
                        </div>
                        {/*--------------------------------*/}

                        {/*IMAGEM*/}
                        <div className={estilos.imagem}>
                            <h2>Imagem</h2>

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

                            <p>Anexe foto para ajudar na solicitação</p>
                        </div>
                        {/*--------------------------------*/}


                        {/*GRAU INTENSIDADE*/}
                        <div className={estilos.grau_intensidade}>
                            <h2>Grau de intensidade</h2>
                            <div className={estilos.grau_intensidade_opcoes}>
                                
                                    <p className={estilos.mensagem_grau_intensidade}>Escolha com sinceridade o grau de intensidade</p> 
                                
                            <label htmlFor="grauIntensidade">
                                <select id="grauIntensidade" onChange={(e) => setIntensidade(e.target.value)}>
                                    <option></option>
                                    <option value="Baixa">Baixa</option>
                                    <option value="Moderada">Moderada</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </label>
                            </div>
                            <p className={intensidade === "Baixa" ? estilos.grau_baixa : intensidade === "Moderada" ? estilos.grau_media : estilos.grau_alto}>{intensidade}</p> 
                        </div>
                        {/*--------------------------------*/}

                        {/*ENDEREÇO*/}
                        <div className={estilos.endereco}>
                            <h2>Endereço</h2>

                            <button className={estilos.mapa} type="button" onClick={() => setShowMapa(true)}>Marcar local no mapa</button>

                            <label htmlFor="cep"> CEP :
                                <input id="cep"
                                value={cep} 
                                type="text" 
                                onChange={(e) => setCep(e.target.value)}/>
                            </label>

                            <label htmlFor="logradouro"> Logradouro :
                                <input id="logradouro" 
                                value={logradouro} 
                                type="text" 
                                onChange={(e) => setLogradouro(e.target.value)}/>
                            </label>

                            <label htmlFor="complemento"> Complemento :
                                <input id="complemento" 
                                value={complemento} 
                                type="text" 
                                onChange={(e) => setComplemento(e.target.value)}/>
                            </label>

                            <label htmlFor="bairro"> Bairro :
                                <input id="bairro" 
                                value={bairro} 
                                type="text" 
                                onChange={(e) => setBairro(e.target.value)}/>
                            </label>

                            <label htmlFor="cidade"> Cidade :
                                <input id="cidade" 
                                value={cidade} 
                                type="text" 
                                onChange={(e) => setCidade(e.target.value)}/>
                            </label>

                            <label htmlFor="estado"> Estado :
                                <input id="estado" 
                                value={estado} 
                                type="text" 
                                onChange={(e) => setEstado(e.target.value)}/>
                            </label>
                        </div>
                        {/*--------------------------------*/}

                            <button className={estilos.enviar}>Enviar Solicitação</button>

                    </form>

            </div>

        </div>

        <Nav/>

        {showMapa && (
            <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "#00000088",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
    <div style={{
      background: "#fff",
      padding: "20px",
      width: "90%",
      maxWidth: "600px",
      borderRadius: "10px"
    }}>
      <MapaModal onSelect={handleEnderecoSelecionado} />
      <button onClick={() => setShowMapa(false)}>Fechar</button>
    </div>

  </div>
)}


        </>

        
    );
}