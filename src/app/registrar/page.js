"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registrarUsuario } from "../../services/authService";
import { validarCPF } from "../../utils/validators";
import logo from "../../../public/logo/Logo.png";
import estilos from "./registrar.module.css";

function CampoSenha({ id, placeholder, registro, erro }) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <>
      <div className={estilos.campoSenha}>
        <input
          id={id}
          type={mostrar ? "text" : "password"}
          placeholder={placeholder}
          className={estilos.input}
          autoComplete="new-password"
          {...registro}
        />
        <button
          type="button"
          className={estilos.toggleSenha}
          onClick={() => setMostrar((p) => !p)}
          aria-label="Mostrar ou ocultar senha"
        >
          {mostrar
            ? <AiOutlineEyeInvisible className={estilos.iconeOlho} />
            : <AiOutlineEye className={estilos.iconeOlho} />}
        </button>
      </div>
      {erro && <span className={estilos.erroField}>{erro.message}</span>}
    </>
  );
}

export default function Registrar() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const senhaValor = watch("senha");

  async function onSubmit(data) {
    setSuccessMessage("");
    setErrorMessage("");
    setCarregando(true);
    try {
      await registrarUsuario({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
        cpf: data.cpf,
      });
      setSuccessMessage("Conta criada com sucesso! Redirecionando...");
      reset();
      setTimeout(() => router.push("/logar"), 2500);
    } catch (err) {
      setErrorMessage(
        err.message || "Erro de conexão. Tente novamente em instantes."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={estilos.pagina}>

      {/* TOPO VERDE */}
      <div className={estilos.topo}>
        <div className={estilos.logoWrapper}>
          <Image src={logo} alt="Logo Arruma Aí" width={84} height={84} />
        </div>
        <h1 className={estilos.appNome}>Arruma Aí</h1>
        <p className={estilos.appSlogan}>Crie sua conta gratuitamente</p>
      </div>

      {/* CARD */}
      <div className={estilos.card}>
        <h2 className={estilos.cardTitulo}>Criar conta</h2>
        <p className={estilos.cardSubtitulo}>Preencha os dados abaixo para se cadastrar</p>

        {successMessage && (
          <div className={estilos.sucesso}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={estilos.erro}>{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={estilos.form}>

          {/* NOME */}
          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              className={estilos.input}
              {...register("nome", {
                required: "Informe o nome completo",
                minLength: { value: 3, message: "Mínimo de 3 caracteres" },
              })}
            />
            {errors.nome && <span className={estilos.erroField}>{errors.nome.message}</span>}
          </div>

          {/* EMAIL */}
          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              className={estilos.input}
              {...register("email", {
                required: "Informe o e-mail",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Digite um e-mail válido",
                },
              })}
            />
            {errors.email && <span className={estilos.erroField}>{errors.email.message}</span>}
          </div>

          {/* SENHA + CONFIRMAR (lado a lado no mobile ficam empilhados) */}
          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="senha">Senha</label>
            <CampoSenha
              id="senha"
              placeholder="Crie uma senha (mín. 8 caracteres)"
              registro={register("senha", {
                required: "Crie uma senha",
                minLength: { value: 8, message: "Mínimo de 8 caracteres" },
              })}
              erro={errors.senha}
            />
          </div>

          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="confirmarSenha">Confirmar senha</label>
            <CampoSenha
              id="confirmarSenha"
              placeholder="Repita a senha"
              registro={register("confirmarSenha", {
                required: "Repita a senha",
                validate: (v) => v === senhaValor || "As senhas não conferem",
              })}
              erro={errors.confirmarSenha}
            />
          </div>

          {/* TELEFONE */}
          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              placeholder="(xx) xxxxx-xxxx"
              inputMode="numeric"
              maxLength={11}
              className={estilos.input}
              {...register("telefone", {
                required: "Informe o telefone",
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                },
                validate: (v) =>
                  v.length === 10 || v.length === 11 || "Digite um telefone com DDD",
              })}
            />
            {errors.telefone && <span className={estilos.erroField}>{errors.telefone.message}</span>}
          </div>

          {/* CPF */}
          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              type="text"
              placeholder="Somente números"
              inputMode="numeric"
              maxLength={11}
              className={estilos.input}
              {...register("cpf", {
                required: "Informe o CPF",
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                },
                validate: (v) => {
                  if (v.length !== 11) return "O CPF deve ter 11 números";
                  if (!validarCPF(v)) return "Digite um CPF válido";
                  return true;
                },
              })}
            />
            {errors.cpf && <span className={estilos.erroField}>{errors.cpf.message}</span>}
          </div>

          {/* TERMOS */}
          <div className={estilos.termosWrapper}>
            <label className={estilos.termosLabel}>
              <input
                type="checkbox"
                className={estilos.checkbox}
                {...register("termos", {
                  required: "Você precisa aceitar os termos de uso",
                })}
              />
              <span>
                Eu li e aceito os{" "}
                <Link href="/termos" className={estilos.termosLink}>termos de uso</Link>
              </span>
            </label>
            {errors.termos && <span className={estilos.erroField}>{errors.termos.message}</span>}
          </div>

          {/* BOTÃO */}
          <button type="submit" className={estilos.btnCadastrar} disabled={carregando}>
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>

          {/* LINK LOGIN */}
          <p className={estilos.jaTemConta}>
            Já tem uma conta?{" "}
            <Link href="/logar" className={estilos.linkEntrar}>Entrar</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
