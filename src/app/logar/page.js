"use client";

import { useRouter } from "next/navigation";
import estilos from "./logar.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import Header from "../../componentes/Header/Header";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Logar() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
  setErrorMessage("");

  try {
    const res = await fetch("https://arruma-ai-api.onrender.com/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        senha: data.senha,
      }),
    });

    if (!res.ok) {
      let erroJson = null;
      try {
        erroJson = await res.json();
      } catch {
        // se não vier JSON, ignora
      }

      const msgBack =
        erroJson?.message ||
        erroJson?.erro ||
        erroJson?.error ||
        erroJson?.errors?.[0];

      setErrorMessage(msgBack || "Email e/ou senha incorreta");
      return;
    }

    const json = await res.json();
    console.log("LOGIN OK JSON:", json);

    // 🧠 TENTA DESCOBRIR ONDE ESTÁ O USUÁRIO
    let usuario = null;

    if (json.usuario) {
      // formato: { token, usuario: { ... } }
      usuario = json.usuario;
    } else if (json.user) {
      // formato: { token, user: { ... } }
      usuario = json.user;
    } else if (json.nome) {
      // formato: { token, id, nome, email, ... } tudo na raiz
      usuario = {
        id: json.id,
        nome: json.nome,
        email: json.email,
        telefone: json.telefone,
        cpf: json.cpf,
        tipo: json.tipo,
        cargo: json.cargo,
      };
    }

    console.log("USUARIO DETECTADO:", usuario);

    if (!usuario) {
      console.warn(
        "⚠ Não foi possível encontrar os dados do usuário no JSON de login. Veja o objeto completo:",
        json
      );
      // ainda assim salva o token para não quebrar o fluxo
      if (json.token) {
        localStorage.setItem("arrumaai_token", json.token);
      }
      router.push("/home");
      return;
    }

    // 🔹 Salva token (se houver)
    if (json.token) {
      localStorage.setItem("arrumaai_token", json.token);
    }

    // 🔹 Salva dados do usuário
    localStorage.setItem("arrumaai_userId", String(usuario.id ?? ""));
    localStorage.setItem("arrumaai_nome", usuario.nome ?? "");
    localStorage.setItem("arrumaai_email", usuario.email ?? "");
    localStorage.setItem("arrumaai_telefone", usuario.telefone ?? "");
    localStorage.setItem("arrumaai_cpf", usuario.cpf ?? "");
    localStorage.setItem("arrumaai_tipo", usuario.tipo ?? "");
    localStorage.setItem("arrumaai_cargo", usuario.cargo ?? "");

    console.log(
      "NOME SALVO NO LOCALSTORAGE:",
      localStorage.getItem("arrumaai_nome")
    );

    router.push("/home");
  } catch (e) {
    console.error("Erro ao chamar API de login:", e);
    setErrorMessage("Erro ao conectar ao servidor.");
  }
}



  return (
    <>
      <Header />

      <div className={estilos.container}>
        <h1 className={estilos.titulo}>Entrar</h1>

        {/* Erro simples */}
        {errorMessage && (
          <div className={estilos.alertaErroSimples}>{errorMessage}</div>
        )}

        <div className={estilos.component_acesso}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={estilos.component_infos}>
              <div>
                <p>E-mail:</p>
                <input
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

              <div>
                <p>Senha:</p>

                <div className={estilos.campoSenha}>
                    <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password" 
                    placeholder="Digite sua senha"
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Mostrar ou ocultar senha"
                    >
                    {showPassword ? (
                    <AiOutlineEyeInvisible className={estilos.iconeOlho} />
                    ) : (
                    <AiOutlineEye className={estilos.iconeOlho} />
                    )}
                </button>
                </div>

                {errors.senha && (
                    <span className={estilos.erro}>{errors.senha.message}</span>
                )}
                </div>
                </div>

            <div className={estilos.component_links}>
              <a className={estilos.recuperar_senha} href="#">
                Esqueci a senha
              </a>
              <span className={estilos.separator}>|</span>
              <Link href="/registrar" className={estilos.criar_conta}>
                Criar conta
              </Link>
            </div>

            <button type="submit" className={estilos.acessar}>
              Entrar
            </button>
          </form>
        </div>

        <hr />

        <div className={estilos.tipos_acessos}>
          <button>
            <FcGoogle className={estilos.logos} /> Continue com Google
          </button>
          <button>
            <FaApple className={estilos.logos} /> Continue com Apple
          </button>
        </div>
      </div>
    </>
  );
}
