import React, { useState } from "react";
import styles from "./index.module.css";
import background from "../../assets/background.png";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function RecuperarAcesso() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "" || email !== "teste@exemplo.com") {
      setError("E-mail não cadastrado");
    } else {
      setError("");
      alert("E-mail encontrado! Código enviado.");
      navigate("/recuperar-codigo")
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `linear-gradient(rgba(255,138,0,0.85), rgba(229,46,113,0.85)), url(${background})`,
      }}
    >
      <div className={styles.containerLogin}>
        <img src={logo} alt="Suculent.us Logo" className={styles.logo} />

        <h2 className={styles.header}>Redefinição de senha</h2>
        <p className={styles.description}>
          Informe o e-mail cadastrado para receber o código de redefinição de senha.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>
            E-mail*
          </label>

          <input
            id="email"
            type="email"
            placeholder="exemplo@gmail.com"
            className={`${styles.input} ${error ? styles.codeInputError : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.loginButton}>
            Enviar
          </button>
        </form>

        <p className={styles.description}>
          Lembrou?{" "}
          <a href="/login" className={styles.resendButton}>
            Faça Login
          </a>
        </p>
      </div>
    </div>
  );
}
