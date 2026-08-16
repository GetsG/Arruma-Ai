import { API_URLS } from "../constants/apiUrls";
import { limparSessao } from "./authService";

export function adaptarProblema(p) {
  return {
    id: p.problemaid,
    data: p.data,
    descricao: p.descricao || "",
    categoria: p.categoria || "",
    rua: p.endereco?.rua || "",
    pontoReferencia: p.endereco?.ponto_referencia || "",
    status: p.status || "",
    imagem: p.imagem?.[0] || null,
  };
}

export async function listarProblemas(token) {
  const res = await fetch(API_URLS.PROBLEM, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    limparSessao();
    throw new Error("UNAUTHORIZED");
  }

  const body = await res.json();

  if (body.success && Array.isArray(body.data)) {
    return body.data.map(adaptarProblema);
  }
  return [];
}

export async function criarProblema(payload, token) {
  const res = await fetch(API_URLS.PROBLEM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401 || res.status === 403) {
    limparSessao();
    throw new Error("UNAUTHORIZED");
  }

  let body = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    const msg =
      res.status >= 500
        ? "O servidor encontrou um problema ao salvar sua solicitação. Tente novamente em alguns minutos."
        : body?.message || "Não foi possível enviar sua solicitação. Tente novamente.";
    throw new Error(msg);
  }
}
