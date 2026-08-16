import { API_URLS } from "../constants/apiUrls";
import { STORAGE_KEYS } from "../constants/storageKeys";

function extrairUsuarioDoJson(json) {
  if (json.usuario) return json.usuario;
  if (json.user) return json.user;
  if (json.nome) {
    return {
      id: json.id,
      nome: json.nome,
      email: json.email,
      telefone: json.telefone,
      cpf: json.cpf,
      tipo: json.tipo,
      cargo: json.cargo,
    };
  }
  return null;
}

export async function login(email, senha) {
  const res = await fetch(API_URLS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    let erroJson = null;
    try {
      erroJson = await res.json();
    } catch {}
    const msg =
      erroJson?.message ||
      erroJson?.erro ||
      erroJson?.error ||
      erroJson?.errors?.[0];
    throw new Error(msg || "Email e/ou senha incorreta");
  }

  const json = await res.json();
  const usuario = extrairUsuarioDoJson(json);

  if (json.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, json.token);
  }

  if (usuario) {
    localStorage.setItem(STORAGE_KEYS.USER_ID, String(usuario.id ?? ""));
    localStorage.setItem(STORAGE_KEYS.NOME, usuario.nome ?? "");
    localStorage.setItem(STORAGE_KEYS.EMAIL, usuario.email ?? "");
    localStorage.setItem(STORAGE_KEYS.TELEFONE, usuario.telefone ?? "");
    localStorage.setItem(STORAGE_KEYS.CPF, usuario.cpf ?? "");
    localStorage.setItem(STORAGE_KEYS.TIPO, usuario.tipo ?? "");
    localStorage.setItem(STORAGE_KEYS.CARGO, usuario.cargo ?? "");
  }
}

export async function registrarUsuario({ nome, email, senha, telefone, cpf }) {
  const res = await fetch(API_URLS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, telefone, cpf }),
  });

  const bodyText = await res.text();
  let bodyJson = null;
  try {
    bodyJson = JSON.parse(bodyText);
  } catch {}

  if (!res.ok) {
    const msg =
      bodyJson?.message ||
      bodyJson?.erro ||
      bodyJson?.error ||
      bodyJson?.errors?.[0];
    throw new Error(
      msg ||
        "Não foi possível criar sua conta. Verifique os dados e tente novamente."
    );
  }
}

export function logout() {
  localStorage.clear();
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function getNome() {
  return localStorage.getItem(STORAGE_KEYS.NOME) || "";
}

export function limparSessao() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
}

export async function buscarDadosUsuario(token) {
  const res = await fetch(API_URLS.USERS_ME, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 403) {
    limparSessao();
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error("Erro ao buscar dados do usuário");

  const json = await res.json();
  return json.user;
}
