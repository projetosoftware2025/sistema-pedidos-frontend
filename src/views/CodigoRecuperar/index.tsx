import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import background from "../../assets/background.png";
import logo from "../../assets/logo.png";

export const CodigoRecuperar: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState<string[]>(["", "", "", "", ""]);
  const [erro, setErro] = useState(false);

  // ✅ Tipagem correta do useRef
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Atualiza o valor digitado e foca no próximo campo
  const handleChange = (valor: string, index: number) => {
    if (/^\d*$/.test(valor)) {
      const novoCodigo = [...codigo];
      novoCodigo[index] = valor;
      setCodigo(novoCodigo);
      setErro(false);

      // Foca no próximo campo se o usuário digitar um número
      if (valor && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // Move o foco ao apagar um campo
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Envio do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const codigoCompleto = codigo.join("");

    if (codigoCompleto === "12345") {
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
          <div className={styles.codeInputs}>
            {codigo.map((valor, i) => (
              <input
                key={i}
                ref={(el: HTMLInputElement | null): void => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                pattern="[0-9]*"
                value={valor}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`${styles.codeInput} ${
                  erro ? styles.codeInputError : ""
                }`}
              />
            ))}
          </div>

          {erro && (
            <p className={styles.errorMessage}>Código inválido. Tente novamente.</p>
          )}

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
