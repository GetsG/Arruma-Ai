"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";

import estilos from "./cadastrar_ocorrencia.module.css";
import Nav from "../../componentes/Nav/Nav.jsx";
import Carregando from "../../componentes/Carregando/Carregando.jsx";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { compressImage, ALLOWED_IMAGE_TYPES } from "../../services/imageService";
import { criarProblema } from "../../services/problemService";
import { getToken } from "../../services/authService";

const Mapa = dynamic(
  () => import("../../componentes/MapaModal/MapaModal.jsx"),
  { ssr: false }
);

export default function CadastrarOcorrencia() {
  const router = useRouter();
  const { carregando } = useRequireAuth();

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [rua, setRua] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
    setError,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });

  const descricao = watch("descricao") || "";
  const categoria = watch("categoria");
  const imagemFiles = watch("imagem");
  const imagemPreview = imagemFiles && imagemFiles.length > 0 ? imagemFiles[0] : null;

  const limite = 50;

  function handleDescricaoChange(e) {
    const texto = e.target.value.slice(0, limite);
    setValue("descricao", texto, { shouldValidate: true });
  }

  function handleLocalSelecionado(end) {
    const lat = end.latitude ?? "";
    const lon = end.longitude ?? "";

    setLatitude(lat);
    setLongitude(lon);
    setRua(end.logradouro || "");

    setValue("latitude", lat, { shouldValidate: true });
    setValue("longitude", lon, { shouldValidate: true });
    clearErrors(["latitude", "longitude"]);
  }

  async function onSubmit(data) {
    setShowErrorPopup(false);
    setShowSuccessPopup(false);
    setApiErrorMessage("");

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
        message: "Marque o local no mapa para continuar.",
      });
      setShowErrorPopup(true);
      return;
    }

    const file = data.imagem?.[0];
    if (!file) {
      setError("imagem", {
        type: "manual",
        message: "Anexe uma imagem para ajudar na solicitação.",
      });
      setShowErrorPopup(true);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const msg = "Formato de imagem não suportado. Use JPG, JPEG, PNG ou WEBP.";
      setError("imagem", { type: "manual", message: msg });
      setApiErrorMessage(msg);
      setShowErrorPopup(true);
      return;
    }

    let imagemBase64;
    try {
      imagemBase64 = await compressImage(file);
    } catch (err) {
      const msg =
        err?.message ||
        "Não foi possível comprimir a imagem. Tente uma foto menor ou recortada.";
      setError("imagem", { type: "manual", message: msg });
      setApiErrorMessage(msg);
      setShowErrorPopup(true);
      return;
    }

    const payload = {
      descricao: descricaoTrim,
      categoriaid: Number(data.categoria),
      latitude: String(lat),
      longitude: String(lon),
      rua: rua,
      ponto_referencia: "",
      imagens: [imagemBase64],
    };

    try {
      const token = getToken();
      if (!token) {
        router.replace("/logar");
        return;
      }

      setEnviando(true);
      await criarProblema(payload, token);

      setShowSuccessPopup(true);
      reset();
      setLatitude("");
      setLongitude("");
      setRua("");

      setTimeout(() => router.push("/ocorrencias"), 1500);
    } catch (err) {
      setEnviando(false);
      if (err.message === "UNAUTHORIZED") {
        router.replace("/logar");
        return;
      }
      setApiErrorMessage(
        err.message || "Erro ao conectar com o servidor. Tente novamente."
      );
      setShowErrorPopup(true);
    }
  }

  function onInvalid() {
    setShowSuccessPopup(false);
    setShowErrorPopup(true);
  }

  const fieldErrorMessages = Object.values(errors)
    .map((err) => err?.message)
    .filter(Boolean);

  const errorMessages = [...fieldErrorMessages];
  if (apiErrorMessage) errorMessages.push(apiErrorMessage);

  const hasErrors = errorMessages.length > 0;

  if (carregando) return <Carregando />;

  return (
    <>
      {/* POPUP DE ERROS */}
      {hasErrors && showErrorPopup && (
        <div className={estilos.erroPopup}>
          <div>
            <strong>
              {fieldErrorMessages.length > 0
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

            {/* LOCAL */}
            <div className={estilos.localSection}>
              <h2>Local</h2>

              <div className={estilos.dicaMapa}>
                <span className={estilos.dicaIcone}>📍</span>
                <p>Toque no local <strong>exato</strong> do problema no mapa para facilitar a localização pela equipe responsável.</p>
              </div>

              <div className={estilos.mapaWrapper}>
                <Mapa onSelect={handleLocalSelecionado} />
              </div>

              {(latitude || rua) && (
                <p className={estilos.localSelecionado}>
                  📍 {rua || "Local marcado"}
                </p>
              )}
            </div>

            {/* campos ocultos para lat/lng */}
            <input
              type="hidden"
              {...register("latitude", {
                required: "Marque o local no mapa para continuar.",
              })}
            />
            <input
              type="hidden"
              {...register("longitude", {
                required: "Marque o local no mapa para continuar.",
              })}
            />

            <button className={estilos.enviar} type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar Solicitação"}
            </button>
          </form>
        </div>
      </div>

      <Nav />
    </>
  );
}
