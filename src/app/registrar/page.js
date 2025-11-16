"use client";

import estilos from "./registrar.module.css";
import Link from "next/link";
import Header from "../../componentes/Header/Header.jsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

class Usuario {
  constructor({ nome, email, senha, telefone, cpf }) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.cpf = cpf;
  }

  toJSON() {
    return { ...this };
  }
}

function validarCPF(cpf) {

  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10), 10)) return false;

  // segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11), 10)) return false;

  return true;
}

export default function Registrar() {
  const router = useRouter();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const senhaValor = watch("senha"); // usado para confirmar senha

 async function onSubmit(data) {
  setSuccessMessage("");
  setErrorMessage("");

  const usuario = new Usuario({
    nome: data.nome,
    email: data.email,
    senha: data.senha,
    telefone: data.telefone,
    cpf: data.cpf,
  });

  console.log("Enviando para o backend:", usuario.toJSON());

  try {
    const res = await fetch("https://arruma-ai-api.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario.toJSON()),
    });

    // 👇 lê o body da resposta (texto bruto)
    const bodyText = await res.text();
    let bodyJson = null;

    try {
      bodyJson = JSON.parse(bodyText); // tenta transformar em JSON
    } catch (e) {
      // se não for JSON, deixa como null
    }

    console.log("Status da API:", res.status);
    console.log("Corpo da resposta:", bodyText);

    if (!res.ok) {
      // tenta pegar uma mensagem vinda do backend
      const msgBack =
        bodyJson?.message ||
        bodyJson?.erro ||
        bodyJson?.error ||
        bodyJson?.errors?.[0];

      setErrorMessage(
        msgBack || "Não foi possível criar sua conta. Verifique os dados e tente novamente."
      );
      return;
    }

    // ✅ deu certo
    setSuccessMessage("Conta criada com sucesso!");
    reset();

    setTimeout(() => {
      router.push("/logar");
    }, 2500);
  } catch (err) {
    console.error("Erro ao chamar API:", err);
    // se quiser, pode até tirar essa mensagem e só logar no console
    setErrorMessage(
      "Erro de conexão com o servidor. Tente novamente em alguns instantes."
    );
  }
}

  return (
    <>
      <Header />

      <div className={estilos.container}>
        <h1>Criar conta</h1>

         {/* MENSAGENS GERAIS */}
        {successMessage && (
          <div className={estilos.mensagemSucesso}>{successMessage}</div>
        )}

        {errorMessage && (
          <div className={estilos.mensagemErroGeral}>{errorMessage}</div>
        )}

        {/* FORMULARIO CORRETO: todos os campos estão dentro do <form> */}
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* NOME */}
          <div className={estilos.campo}>
            <label htmlFor="nome">Nome Completo:</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              {...register("nome", {
                required: "Informe o nome completo",
                minLength: {
                  value: 3,
                  message: "O nome precisa ter pelo menos 3 caracteres",
                },
              })}
            />
            {errors.nome && (
              <span className={estilos.erro}>{errors.nome.message}</span>
            )}
          </div>

          {/* EMAIL */}
          <div className={estilos.campo}>
            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              {...register("email", {
                required: "Informe o e-mail",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Digite um e-mail válido",
                },
              })}
            />
            {errors.email && (
              <span className={estilos.erro}>{errors.email.message}</span>
            )}
          </div>

          {/* SENHA */}
          <div className={estilos.campo}>
            <label htmlFor="senha">Criar senha:</label>
            <input
              id="senha"
              type="password"
              placeholder="Crie uma senha"
              {...register("senha", {
                required: "Crie uma senha",
                minLength: {
                  value: 8,
                  message: "A senha precisa ter pelo menos 8 caracteres",
                },
              })}
            />
            {errors.senha && (
              <span className={estilos.erro}>{errors.senha.message}</span>
            )}
          </div>

          {/* CONFIRMAR SENHA */}
          <div className={estilos.campo}>
            <label htmlFor="confirmarSenha">Repetir senha:</label>
            <input
              id="confirmarSenha"
              type="password"
              placeholder="Repita a senha"
              {...register("confirmarSenha", {
                required: "Repita a senha",
                validate: (value) =>
                  value === senhaValor || "As senhas não conferem",
              })}
            />
            {errors.confirmarSenha && (
              <span className={estilos.erro}>
                {errors.confirmarSenha.message}
              </span>
            )}
          </div>

         {/* TELEFONE */}
            <div className={estilos.campo}>
                <label htmlFor="telefone">Telefone:</label>
                <input
                id="telefone"
                type="tel"
                placeholder="(xx) xxxxx-xxxx"
                inputMode="numeric"      // abre teclado numérico no celular
                maxLength={11}           // corta no 11º caractere
                {...register("telefone", {
                required: "Informe o telefone",
                onChange: (e) => {
                // remove tudo que NÃO é número e limita em 11 dígitos
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                },
                validate: (value) => {
                const len = value.length;
                return (
                (len === 10 || len === 11) ||
                "Digite um telefone com DDD (10 ou 11 números)"
                );
        },
        })}
        />
            {errors.telefone && (
                <span className={estilos.erro}>{errors.telefone.message}</span>
            )}
        </div>

        {/* CPF */}
        <div className={estilos.campo}>
        <label htmlFor="cpf">CPF:</label>
        <input
        id="cpf"
        type="text"
        placeholder="Somente números"
        inputMode="numeric"        // teclado numérico no celular
        maxLength={11}             // no máximo 11 caracteres
        {...register("cpf", {
        required: "Informe o CPF",
        onChange: (e) => {
        // deixa só números e limita em 11 dígitos
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
      },
      validate: (value) => {
        if (value.length !== 11) {
          return "O CPF deve ter 11 números";
        }
        if (!validarCPF(value)) {
          return "Digite um CPF válido";
        }
        return true;
        },
            })}
        />
        {errors.cpf && (
            <span className={estilos.erro}>{errors.cpf.message}</span>
        )}
    </div>

          {/* TERMOS */}
          <div className={estilos.termos}>
            <input
              type="checkbox"
              id="termos"
              {...register("termos", {
                required: "Você precisa aceitar os termos de uso",
              })}
            />
            <div className={estilos.texto_termos}>
              <label htmlFor="termos">
                Eu li e aceito os <a href="#">termos de uso</a>.
              </label>
            </div>
          </div>
          {errors.termos && (
            <span className={estilos.erro}>{errors.termos.message}</span>
          )}

          {/* BOTÕES */}
          <div className={estilos.container_botoes}>
            <Link href="/logar">
              <button type="button">Cancelar</button>
            </Link>

            <button
              type="submit"
              className={estilos.cadastrar}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
