import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import background from "../../assets/background.png";
import logo from "../../assets/logo.png";

export const CodigoRecuperar: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (codigo === "12345") {
      setErro(false);
      alert("✅ Código válido! Redirecionando para redefinição...");
      navigate("/nova-senha");
    } else {
      setErro(true);
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
          Preencha o campo abaixo com o código enviado para o e-mail
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className={`${styles.codeInput} ${erro ? styles.codeInputError : ""}`}
            placeholder="Digite o código"
          />

          {erro && <p className={styles.errorMessage}>Código inválido. Tente novamente.</p>}

          <button
            type="button"
            onClick={() => alert("📩 Código reenviado para o e-mail!")}
            className={styles.resendButton}
          >
            Reenviar código
          </button>

          <button type="submit" className={styles.loginButton}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodigoRecuperar;
