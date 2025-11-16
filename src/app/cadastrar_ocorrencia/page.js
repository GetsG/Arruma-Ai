"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";

import estilos from "./cadastrar_ocorrencia.module.css";
import Nav from "../../componentes/Nav/Nav.jsx";
import Carregando from "../../componentes/Carregando/Carregando.jsx";

const MapaModal = dynamic(
  () => import("../../componentes/MapaModal/MapaModal.jsx"),
  { ssr: false }
);

// ---------------------------------------------
// Helpers
// ---------------------------------------------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
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

  const [carregando, setCarregando] = useState(true);
  const [userId, setUserId] = useState(""); // só pra garantir que está logado

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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

  const descricao = watch("descricao") || "";
  const categoria = watch("categoria");
  const intensidade = watch("intensidade");
  const imagemFiles = watch("imagem");
  const imagemPreview =
    imagemFiles && imagemFiles.length > 0 ? imagemFiles[0] : null;

  // contador de caracteres
  const limite = 50;

  function handleDescricaoChange(e) {
    const texto = e.target.value.slice(0, limite);
    setValue("descricao", texto, { shouldValidate: true });
  }

  // -------------------------------------------
  // Preenche endereço e limpa erros
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

    // coord do mapa
    setLatitude(end.latitude || "");
    setLongitude(end.longitude || "");

    // se quiser, também joga nos campos escondidos
    setValue("latitude", end.latitude || "");
    setValue("longitude", end.longitude || "");

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
    const apenasNumeros = e.target.value.replace(/\D/g, "").slice(0, 8);
    setValue("cep", apenasNumeros, { shouldValidate: true });
  }

  // -------------------------------------------
  // SUBMIT VÁLIDO
  // -------------------------------------------
  async function onSubmit(data) {
    console.log("=== SUBMIT DISPARADO ===");
    console.log("Dados do formulário:", data);

    setShowErrorPopup(false);
    setShowSuccessPopup(false);

    // imagem -> base64
    const file = data.imagem?.[0];
    const imagemBase64 = file ? await fileToBase64(file) : null;
    const imagens = imagemBase64 ? [imagemBase64] : [];

    // categoriaid numérico
    const categoriaid = Number(data.categoria); // "1" -> 1

    // latitude/longitude (preferem do mapa)
    const lat = latitude || data.latitude || "";
    const lon = longitude || data.longitude || "";

    const payload = {
      descricao: data.descricao,
      categoriaid,
      latitude: lat,
      longitude: lon,
      rua: data.logradouro || "",
      ponto_referencia: data.complemento || "",
      imagens,
    };

    console.log("PAYLOAD ENVIADO PARA /problems:", payload);

    try {
  const token = localStorage.getItem("arrumaai_token");

  if (!token) {
    // segurança extra: se por algum motivo não tiver token aqui
    router.replace("/logar");
    return;
  }

  const res = await fetch("https://arruma-ai-api.onrender.com/problem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    // caso a resposta não seja JSON
  }

  console.log("STATUS /problem:", res.status);
  console.log("RESPOSTA /problem:", body);

  if (res.status === 401 || res.status === 403) {
    // token inválido/expirado: limpa e manda pro login
    localStorage.removeItem("arrumaai_token");
    localStorage.removeItem("arrumaai_userId");
    router.replace("/logar");
    return;
  }

  if (!res.ok) {
    setShowErrorPopup(true);
    return;
  }

  setShowSuccessPopup(true);
  reset();

  setTimeout(() => {
    router.push("/ocorrencias");
  }, 1500);
} catch (err) {
  console.error("Erro ao chamar API /problem:", err);
  setShowErrorPopup(true);
}}

  // -------------------------------------------
  // SUBMIT INVÁLIDO
  // -------------------------------------------
  function onInvalid(errors) {
    console.log("Erros de validação:", errors);
    setShowSuccessPopup(false);
    setShowErrorPopup(true);
  }

  const classeIntensidade = getClasseIntensidade(intensidade, estilos);

  const errorMessages = Object.values(errors)
    .map((err) => err?.message)
    .filter(Boolean);

  const hasErrors = errorMessages.length > 0;

  // Proteção de rota
  useEffect(() => {
    const token = localStorage.getItem("arrumaai_token");

    if (!token) {
      router.replace("/logar");
      return;
    }

    const id = localStorage.getItem("arrumaai_userId") || "";
    setUserId(id);
    setCarregando(false);
  }, [router]);

  if (carregando) {
    return <Carregando />;
  }

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
                    {...register("categoria", {
                      required: "Escolha uma categoria",
                    })}
                  >
                    <option value=""></option>
                    <option value="1">Infraestrutura</option>
                    <option value="2">Iluminação Pública</option>
                    <option value="3">Saneamento</option>
                    <option value="4">Segurança</option>
                    <option value="5">Transporte</option>
                  </select>
                </label>
              </div>
              <p className={estilos.mostrar_categoria}>
                {categoria === "1"
                  ? "Infraestrutura"
                  : categoria === "2"
                  ? "Iluminação Pública"
                  : categoria === "3"
                  ? "Saneamento"
                  : categoria === "4"
                  ? "Segurança"
                  : categoria === "5"
                  ? "Transporte"
                  : ""}
              </p>
            </div>

            {/* DESCRIÇÃO */}
            <div className={estilos.descricao}>
              <h2>Descrição</h2>
              <label htmlFor="descricao">
                <input
                  id="descricao"
                  type="text"
                  placeholder="Preencha com o seu relato ou denúncia"
                  {...register("descricao", {
                    required: "Descrição é obrigatória",
                  })}
                  maxLength={50}
                  onChange={handleDescricaoChange}
                />
                <p className={estilos.contador}>
                  {descricao.length} / {limite} caracteres
                </p>
              </label>
            </div>

            {/* IMAGEM */}
            <div className={estilos.imagem}>
              <h2>Imagem</h2>

              <label htmlFor="imagem">Anexar Imagem</label>

              <input
                id="imagem"
                type="file"
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

            {/* GRAU INTENSIDADE (visual) */}
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
                  {...register("logradouro", {
                    required: "Informe o logradouro",
                  })}
                  maxLength={100}
                />
              </label>

              <label htmlFor="complemento">
                Complemento :
                <input
                  id="complemento"
                  type="text"
                  {...register("complemento")}
                  maxLength={50}
                />
              </label>

              <label htmlFor="bairro">
                Bairro :
                <input
                  id="bairro"
                  type="text"
                  {...register("bairro", { required: "Informe o bairro" })}
                  maxLength={100}
                />
              </label>

              <label htmlFor="cidade">
                Cidade :
                <input
                  id="cidade"
                  type="text"
                  {...register("cidade", { required: "Informe a cidade" })}
                  maxLength={50}
                />
              </label>

              <label htmlFor="estado">
                Estado :
                <input
                  id="estado"
                  type="text"
                  {...register("estado", { required: "Informe o estado" })}
                  maxLength={50}
                />
              </label>
            </div>

            {/* ocultos para debug se quiser usar no form */}
            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />

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
