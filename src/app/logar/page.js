"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { login } from "../../services/authService";
import logo from "../../../public/logo/Logo.png";
import estilos from "./logar.module.css";

export default function Logar() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setErrorMessage("");
    setCarregando(true);
    try {
      await login(data.email, data.senha);
      router.push("/home");
    } catch (e) {
      setErrorMessage(e.message || "Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={estilos.pagina}>

      {/* TOPO VERDE */}
      <div className={estilos.topo}>
        <div className={estilos.logoWrapper}>
          <Image src={logo} alt="Logo Arruma Aí" width={90} height={90} />
        </div>
        <h1 className={estilos.appNome}>Arruma Aí</h1>
        <p className={estilos.appSlogan}>Relate. Transforme. Melhore.</p>
      </div>

      {/* CARD DO FORMULÁRIO */}
      <div className={estilos.card}>
        <h2 className={estilos.cardTitulo}>Bem-vindo de volta</h2>
        <p className={estilos.cardSubtitulo}>Entre com sua conta para continuar</p>

        {errorMessage && (
          <div className={estilos.erro}>{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={estilos.form}>

          {/* E-MAIL */}
          <div className={estilos.campo}>
            <label className={estilos.label}>E-mail</label>
            <input
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
            {errors.email && (
              <span className={estilos.erroField}>{errors.email.message}</span>
            )}
          </div>

          {/* SENHA */}
          <div className={estilos.campo}>
            <label className={estilos.label}>Senha</label>
            <div className={estilos.campoSenha}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className={estilos.input}
                autoComplete="current-password"
                {...register("senha", {
                  required: "Informe a senha",
                  minLength: {
                    value: 8,
                    message: "A senha precisa ter pelo menos 8 caracteres",
                  },
                })}
              />
              <button
                type="button"
                className={estilos.toggleSenha}
                onClick={() => setShowPassword((p) => !p)}
                aria-label="Mostrar ou ocultar senha"
              >
                {showPassword
                  ? <AiOutlineEyeInvisible className={estilos.iconeOlho} />
                  : <AiOutlineEye className={estilos.iconeOlho} />}
              </button>
            </div>
            {errors.senha && (
              <span className={estilos.erroField}>{errors.senha.message}</span>
            )}
          </div>

          {/* LINKS */}
          <div className={estilos.links}>
            <a href="#" className={estilos.link}>Esqueci a senha</a>
            <Link href="/registrar" className={estilos.link}>Criar conta</Link>
          </div>

          {/* BOTÃO */}
          <button type="submit" className={estilos.btnEntrar} disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </div>
    </div>
  );
}
