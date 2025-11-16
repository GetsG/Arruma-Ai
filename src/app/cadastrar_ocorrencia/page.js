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
async function fileToBase64(file) {
  // limites mais agressivos
  const MAX_WIDTH = 800;
  const MAX_HEIGHT = 800;

  // vamos tentar primeiro com 0.7, se ainda ficar muito grande, 0.5
  async function compress(quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          const scale = Math.min(
            MAX_WIDTH / width,
            MAX_HEIGHT / height,
            1 // não aumenta, só reduz
          );

          const canvas = document.createElement("canvas");
          canvas.width = width * scale;
          canvas.height = height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // sempre sai em JPEG independente do formato original
          const dataUrl = canvas.toDataURL("image/jpeg", quality);

          console.log("Dimensões originais:", width, "x", height);
          console.log("Dimensões após resize:", canvas.width, "x", canvas.height);
          console.log(
            `Base64 (quality=${quality}) tamanho aproximado:`,
            dataUrl.length,
            "chars"
          );

          resolve(dataUrl);
        };

        img.onerror = (err) => {
          console.error("Erro ao carregar imagem para compressão:", err);
          reject(err);
        };

        img.src = reader.result;
      };

      reader.onerror = (err) => {
        console.error("Erro ao ler arquivo de imagem:", err);
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  }

  // primeira tentativa com qualidade 0.7
  let dataUrl = await compress(0.7);

  // se ainda ficar muito grande em base64, tenta 0.5
  // (número de chars não é perfeito, mas ~120k chars já é bem ok)
  if (dataUrl.length > 120_000) {
    console.log("Base64 ainda grande, tentando compressão extra (0.5)...");
    dataUrl = await compress(0.5);
  }

  return dataUrl;
}

function getClasseIntensidade(intensidade, estilos) {
  if (intensidade === "Baixa") return estilos.grau_baixa;
  if (intensidade === "Moderada") return estilos.grau_media;
  if (intensidade === "Alta") return estilos.grau_alto;
  return "";
}

// limites de imagem (arquivo original)
const MAX_IMAGE_SIZE_MB = 1; // agora 1MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ---------------------------------------------
// Componente
// ---------------------------------------------
export default function Ocorrencias() {
  const router = useRouter();

  const [showMapa, setShowMapa] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [carregando, setCarregando] = useState(true);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [carregandoCoords, setCarregandoCoords] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
    setError,
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

  const limite = 50;

  function handleDescricaoChange(e) {
    const texto = e.target.value.slice(0, limite);
    setValue("descricao", texto, { shouldValidate: true });
  }

  // -------------------------------------------
  // Geocodificação: endereço -> latitude/longitude
  // -------------------------------------------
  async function buscarCoordenadasPorEndereco({
    logradouro,
    bairro,
    cidade,
    estado,
  }) {
    if (!logradouro || !cidade || !estado) return;

    try {
      setCarregandoCoords(true);
      setApiErrorMessage("");

      const query = encodeURIComponent(
        `${logradouro}, ${bairro || ""}, ${cidade} - ${estado}, Brasil`
      );

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
        {
          headers: {
            "User-Agent": "ArrumaAi-TCC-Front",
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const lat = String(data[0].lat);
        const lon = String(data[0].lon);

        setLatitude(lat);
        setLongitude(lon);

        setValue("latitude", lat, { shouldValidate: true });
        setValue("longitude", lon, { shouldValidate: true });

        clearErrors(["latitude", "longitude"]);

        console.log("COORDENADAS ENCONTRADAS:", lat, lon);
      } else {
        setLatitude("");
        setLongitude("");
        setValue("latitude", "", { shouldValidate: true });
        setValue("longitude", "", { shouldValidate: true });

        setError("latitude", {
          type: "manual",
          message:
            "Não foi possível localizar automaticamente. Marque o local no mapa.",
        });
        setError("longitude", {
          type: "manual",
          message:
            "Não foi possível localizar automaticamente. Marque o local no mapa.",
        });
        setShowErrorPopup(true);
      }
    } catch (err) {
      console.error("Erro ao buscar coordenadas:", err);
      setLatitude("");
      setLongitude("");
      setValue("latitude", "", { shouldValidate: true });
      setValue("longitude", "", { shouldValidate: true });

      setError("latitude", {
        type: "manual",
        message:
          "Erro ao localizar endereço. Marque o local no mapa para continuar.",
      });
      setError("longitude", {
        type: "manual",
        message:
          "Erro ao localizar endereço. Marque o local no mapa para continuar.",
      });
      setShowErrorPopup(true);
    } finally {
      setCarregandoCoords(false);
    }
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

    const lat = end.latitude != null ? String(end.latitude) : "";
    const lon = end.longitude != null ? String(end.longitude) : "";

    setLatitude(lat);
    setLongitude(lon);

    setValue("latitude", lat, { shouldValidate: true });
    setValue("longitude", lon, { shouldValidate: true });

    clearErrors(["latitude", "longitude"]);

    setShowMapa(false);
  }

  // CEP + ViaCEP + geocodificação
  async function buscarCep(e) {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
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

          await buscarCoordenadasPorEndereco({
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
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
    setApiErrorMessage("");

    if (carregandoCoords) {
      setApiErrorMessage(
        "Ainda estamos localizando o endereço. Aguarde alguns segundos e tente novamente."
      );
      setShowErrorPopup(true);
      return;
    }

    const descricaoTrim = (data.descricao || "").trim();
    if (descricaoTrim.length < 5) {
      setError("descricao", {
        type: "manual",
        message: "A descrição deve ter pelo menos 5 caracteres.",
      });
      setShowErrorPopup(true);
      return;
    }

    const lat = data.latitude || latitude;
    const lon = data.longitude || longitude;

    if (!lat || !lon) {
      setError("latitude", {
        type: "manual",
        message: "Marque o local no mapa ou preencha um CEP válido.",
      });
      setError("longitude", {
        type: "manual",
        message: "Marque o local no mapa ou preencha um CEP válido.",
      });
      setShowErrorPopup(true);
      return;
    }

    // ---------------------------------------
    // Validação da imagem (tipo + tamanho)
    // ---------------------------------------
    const file = data.imagem?.[0];

    if (!file) {
      setError("imagem", {
        type: "manual",
        message: "Anexe uma imagem para ajudar na solicitação.",
      });
      setShowErrorPopup(true);
      return;
    }

    console.log("Imagem selecionada:", {
      name: file.name,
      type: file.type,
      sizeKb: (file.size / 1024).toFixed(1),
    });

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const msg =
        "Formato de imagem não suportado. Use JPG, JPEG, PNG ou WEBP.";
      setError("imagem", { type: "manual", message: msg });
      setApiErrorMessage(msg);
      setShowErrorPopup(true);
      return;
    }

    const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      const msg = `Imagem muito grande. Tamanho máximo permitido é ${MAX_IMAGE_SIZE_MB}MB.`;
      setError("imagem", { type: "manual", message: msg });
      setApiErrorMessage(msg);
      setShowErrorPopup(true);
      return;
    }

    // imagem -> base64 (com compressão)
    const imagemBase64 = await fileToBase64(file); // dataURL (já com header image/jpeg)

    // garante que vai no formato data:image/jpeg;base64,...
    const imagemFinal = `data:image/jpeg;base64,${imagemBase64.split(",").pop()}`;
    const imagens = [imagemFinal];

    const categoriaid = Number(data.categoria);

    const payload = {
      descricao: descricaoTrim,
      categoriaid,
      latitude: String(lat),
      longitude: String(lon),
      rua: data.logradouro || "",
      ponto_referencia: data.complemento || "",
      imagens,
    };

    console.log("PAYLOAD ENVIADO PARA /problem:", payload);

    try {
      const token = localStorage.getItem("arrumaai_token");
      if (!token) {
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
        // resposta sem json
      }

      console.log("STATUS /problem:", res.status);
      console.log("RESPOSTA /problem (json):", JSON.stringify(body, null, 2));

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("arrumaai_token");
        localStorage.removeItem("arrumaai_userId");
        router.replace("/logar");
        return;
      }

      if (!res.ok) {
        if (res.status >= 500) {
          setApiErrorMessage(
            "O servidor encontrou um problema ao salvar sua solicitação. Tente novamente em alguns minutos."
          );
        } else if (body && body.message) {
          setApiErrorMessage(body.message);
        } else {
          setApiErrorMessage(
            "Não foi possível enviar sua solicitação. Tente novamente."
          );
        }

        setShowErrorPopup(true);
        return;
      }

      // sucesso
      setShowSuccessPopup(true);
      reset();
      setLatitude("");
      setLongitude("");
      setValue("latitude", "");
      setValue("longitude", "");

      setTimeout(() => {
        router.push("/ocorrencias");
      }, 1500);
    } catch (err) {
      console.error("Erro ao chamar API /problem:", err);
      setApiErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
      setShowErrorPopup(true);
    }
  }

  // -------------------------------------------
  // SUBMIT INVÁLIDO
  // -------------------------------------------
  function onInvalid(errors) {
    console.log("Erros de validação:", errors);
    setShowSuccessPopup(false);
    setShowErrorPopup(true);
  }

  const classeIntensidade = getClasseIntensidade(intensidade, estilos);

  const fieldErrorMessages = Object.values(errors)
    .map((err) => err?.message)
    .filter(Boolean);

  const temErrosCampos = fieldErrorMessages.length > 0;

  const errorMessages = [...fieldErrorMessages];
  if (apiErrorMessage) errorMessages.push(apiErrorMessage);

  const hasErrors = errorMessages.length > 0;

  // Proteção de rota
  useEffect(() => {
    const token = localStorage.getItem("arrumaai_token");

    if (!token) {
      router.replace("/logar");
      return;
    }

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
            <strong>
              {temErrosCampos
                ? "Verifique os campos:"
                : "Ocorreu um erro ao enviar sua solicitação:"}
            </strong>
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
                    minLength: {
                      value: 5,
                      message: "A descrição deve ter pelo menos 5 caracteres",
                    },
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
                  {...register("bairro", {
                    required: "Informe o bairro",
                  })}
                  maxLength={100}
                />
              </label>

              <label htmlFor="cidade">
                Cidade :
                <input
                  id="cidade"
                  type="text"
                  {...register("cidade", {
                    required: "Informe a cidade",
                  })}
                  maxLength={50}
                />
              </label>

              <label htmlFor="estado">
                Estado :
                <input
                  id="estado"
                  type="text"
                  {...register("estado", {
                    required: "Informe o estado",
                  })}
                  maxLength={50}
                />
              </label>
            </div>

            {/* ocultos para lat/long */}
            <input
              type="hidden"
              {...register("latitude", {
                required:
                  "Não foi possível obter a latitude. Marque o local no mapa.",
              })}
            />
            <input
              type="hidden"
              {...register("longitude", {
                required:
                  "Não foi possível obter a longitude. Marque o local no mapa.",
              })}
            />

            <button
              className={estilos.enviar}
              type="submit"
              disabled={carregandoCoords}
            >
              {carregandoCoords
                ? "Aguarde, localizando endereço..."
                : "Enviar Solicitação"}
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
