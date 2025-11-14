'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import estilos from "./cadastrar_ocorrencia.module.css";
import Nav from "../../componentes/Nav/Nav.jsx";

const MapaModal = dynamic(
  () => import("../../componentes/MapaModal/MapaModal.jsx"),
  { ssr: false }
);

// ---------------------------------------------
// Modelo da ocorrência
// ---------------------------------------------
class Ocorrencia {
  constructor({
    categoria,
    descricao,
    intensidade,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado,
    imagemBase64,
  }) {
    this.categoria = categoria;
    this.descricao = descricao;
    this.intensidade = intensidade;
    this.cep = cep;
    this.logradouro = logradouro;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.imagem = imagemBase64; // string base64 para o banco
  }

  toJSON() {
    return { ...this };
  }
}

// ---------------------------------------------
// Helpers puros
// ---------------------------------------------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // base64
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getClasseIntensidade(intensidade, estilos) {
  if (intensidade === "Baixa") return estilos.grau_baixa;
  if (intensidade === "Moderada") return estilos.grau_media;
  if (intensidade === "Alta") return estilos.grau_alto;
  return "";
}

// ---------------------------------------------
// Componente
// ---------------------------------------------
export default function Ocorrencias() {
  const router = useRouter();

  const [showMapa, setShowMapa] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const categoria = watch("categoria");
  const intensidade = watch("intensidade");
  const imagemFiles = watch("imagem");
  const imagemPreview =
    imagemFiles && imagemFiles.length > 0 ? imagemFiles[0] : null;

  // -------------------------------------------
  // Preenche endereço e limpa erros de endereço
  // -------------------------------------------
  function preencherEndereco({
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    estado,
  }) {
    setValue("cep", cep || "", { shouldValidate: true });
    setValue("logradouro", logradouro || "", { shouldValidate: true });
    setValue("complemento", numero || "", { shouldValidate: true });
    setValue("bairro", bairro || "", { shouldValidate: true });
    setValue("cidade", cidade || "", { shouldValidate: true });
    setValue("estado", estado || "", { shouldValidate: true });

    clearErrors(["cep", "logradouro", "bairro", "cidade", "estado"]);
  }

  // endereço vindo do mapa
  function handleEnderecoSelecionado(end) {
    preencherEndereco({
      cep: end.cep,
      logradouro: end.logradouro,
      numero: end.numero,
      bairro: end.bairro,
      cidade: end.cidade,
      estado: end.estado,
    });
    setShowMapa(false);
  }

  // CEP digitado manualmente: só números + ViaCEP
  async function buscarCep(e) {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await res.json();

      if (!dados.erro) {
        preencherEndereco({
          cep,
          logradouro: dados.logradouro,
          numero: "",
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,
        });
      }
    }
  }

  function handleCepChange(e) {
    const apenasNumeros = e.target.value
      .replace(/\D/g, "")
      .slice(0, 8); // máximo 8 dígitos
    setValue("cep", apenasNumeros, { shouldValidate: true });
  }

  // -------------------------------------------
  // Submit VÁLIDO
  // (API ainda é só "best effort", não bloqueia UX)
  // -------------------------------------------
  async function onSubmit(data) {
    setShowErrorPopup(false);
    setShowSuccessPopup(true);

    const file = data.imagem?.[0];
    const imagemBase64 = file ? await fileToBase64(file) : null;

    const ocorrencia = new Ocorrencia({
      categoria: data.categoria,
      descricao: data.descricao,
      intensidade: data.intensidade,
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      imagemBase64,
    });

    console.log("Enviando para o backend:", ocorrencia);

    // Chama API sem travar fluxo de sucesso
    fetch("http://localhost:8080/ocorrencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ocorrencia.toJSON()),
    })
      .then((res) => {
        console.log("Status da API:", res.status);
      })
      .catch((err) => {
        console.error("Erro ao chamar API:", err);
      });

    reset();

    // mostra popup e depois troca rota
    setTimeout(() => {
      router.push("/ocorrencias");
    }, 1500);
  }

  // -------------------------------------------
  // Submit INVÁLIDO (erros de formulário)
  // -------------------------------------------
  function onInvalid() {
    setShowSuccessPopup(false);
    setShowErrorPopup(true);
  }

  const classeIntensidade = getClasseIntensidade(intensidade, estilos);

  const errorMessages = Object.values(errors)
    .map((err) => err?.message)
    .filter(Boolean);

  const hasErrors = errorMessages.length > 0;

  // -------------------------------------------
  // JSX (return) continua igual
  // -------------------------------------------
  return (
    <>
      {/* POPUP GLOBAL DE ERROS */}
      {hasErrors && showErrorPopup && (
        <div className={estilos.erroPopup}>
          <div>
            <strong>Verifique os campos:</strong>
            <ul>
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className={estilos.erroPopupClose}
            onClick={() => setShowErrorPopup(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* POPUP DE SUCESSO */}
      {showSuccessPopup && (
        <div className={estilos.sucessoPopup}>
          <span>Ocorrência salva com sucesso!</span>
          <button
            type="button"
            className={estilos.erroPopupClose}
            onClick={() => setShowSuccessPopup(false)}
          >
            ×
          </button>
        </div>
      )}

      <div className={estilos.container}>
        <div className={estilos.container_topo}>
          <h1>Vamos criar uma nova solicitação ?</h1>
          <p>Preencha os campos a seguir</p>
        </div>

        <div className={estilos.container_main}>
          <p className={estilos.mensagem_aviso}>
            Preencha com seu relato ou denúncia
          </p>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            {/* CATEGORIA */}
            <div className={estilos.categoria}>
              <h2>Categoria</h2>
              <div className={estilos.categoria_opcoes}>
                <p className={estilos.mensagem_categoria}>
                  Escolha a categoria da sua solicitação
                </p>
                <label htmlFor="categoria">
                  <select
                    id="categoria"
                    {...register("categoria", { required: "Escolha uma categoria" })}
                  >
                    <option value=""></option>
                    <option value="Buraco na Via">Buraco na rua</option>
                    <option value="Luz da rua queimada">Luz da rua queimada</option>
                    <option value="Semáforo quebrado">Semáforo quebrado</option>
                    <option value="Árvore caída">Árvore caída</option>
                    <option value="Vazamento na rua">Vazamento na rua</option>
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
                <input
                  id="descricao"
                  type="text"
                  placeholder="Preencha com o seu relato ou denúncia"
                  {...register("descricao", { required: "Descrição é obrigatória" })}
                />
              </label>
            </div>
            {/*--------------------------------*/}

            {/* IMAGEM */}
            <div className={estilos.imagem}>
              <h2>Imagem</h2>

              <label htmlFor="imagem">Anexar Imagem</label>

              <input
                id="imagem"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                {...register("imagem", {
                  required: "Anexe uma imagem para ajudar na solicitação",
                })}
              />

              {imagemPreview && (
                <img
                  src={URL.createObjectURL(imagemPreview)}
                  alt="Prévia da imagem"
                  width={200}
                />
              )}

              <p>Anexe foto para ajudar na solicitação</p>
            </div>
            {/*--------------------------------*/}

            {/* GRAU INTENSIDADE */}
            <div className={estilos.grau_intensidade}>
              <h2>Grau de intensidade</h2>
              <div className={estilos.grau_intensidade_opcoes}>
                <p className={estilos.mensagem_grau_intensidade}>
                  Escolha com sinceridade o grau de intensidade
                </p>

                <label htmlFor="grauIntensidade">
                  <select
                    id="grauIntensidade"
                    {...register("intensidade", {
                      required: "Informe o grau de intensidade",
                    })}
                  >
                    <option value=""></option>
                    <option value="Baixa">Baixa</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Alta">Alta</option>
                  </select>
                </label>
              </div>

              <p className={classeIntensidade}>{intensidade}</p>
            </div>
            {/*--------------------------------*/}

            {/* ENDEREÇO */}
            <div className={estilos.endereco}>
              <h2>Endereço</h2>

              <button
                className={estilos.mapa}
                type="button"
                onClick={() => setShowMapa(true)}
              >
                Marcar local no mapa
              </button>

              <label htmlFor="cep">
                CEP :
                <input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  {...register("cep", { required: "Informe o CEP" })}
                  onChange={handleCepChange}
                  onBlur={buscarCep}
                />
              </label>

              <label htmlFor="logradouro">
                Logradouro :
                <input
                  id="logradouro"
                  type="text"
                  {...register("logradouro", { required: "Informe o logradouro" })}
                />
              </label>

              <label htmlFor="complemento">
                Complemento :
                <input id="complemento" type="text" {...register("complemento")} />
              </label>

              <label htmlFor="bairro">
                Bairro :
                <input
                  id="bairro"
                  type="text"
                  {...register("bairro", { required: "Informe o bairro" })}
                />
              </label>

              <label htmlFor="cidade">
                Cidade :
                <input
                  id="cidade"
                  type="text"
                  {...register("cidade", { required: "Informe a cidade" })}
                />
              </label>

              <label htmlFor="estado">
                Estado :
                <input
                  id="estado"
                  type="text"
                  {...register("estado", { required: "Informe o estado" })}
                />
              </label>
            </div>
            {/*--------------------------------*/}

            <button className={estilos.enviar} type="submit">
              Enviar Solicitação
            </button>
          </form>
        </div>
      </div>

      <Nav />

      {showMapa && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#00000088",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              width: "90%",
              maxWidth: "600px",
              borderRadius: "10px",
            }}
          >
            <MapaModal onSelect={handleEnderecoSelecionado} />
            <button
              className={estilos.fecharMapa}
              onClick={() => setShowMapa(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
