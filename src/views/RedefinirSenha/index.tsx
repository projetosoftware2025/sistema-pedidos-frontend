import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import background from "../../assets/background.png";
import logo from "../../assets/logo.png";

export const RedefinirSenha: React.FC = () => {
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Regras de validação
  const temCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha);
  const temLetraMaiuscula = /[A-Z]/.test(novaSenha);
  const tamanhoMinimo = novaSenha.length >= 8;

  const senhaValida = temCaractereEspecial && temLetraMaiuscula && tamanhoMinimo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaValida) {
      alert("✅ Senha redefinida com sucesso!");
      navigate("/login");
    } else {
      alert("⚠️ Sua senha não atende aos requisitos.");
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `linear-gradient(rgba(255,138,0,0.85), rgba(229,46,113,0.85)), url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.containerLogin}>
        <img src={logo} alt="Logo Suculent.us" className={styles.logo} />
        <h2 className={styles.header}>Redefinição de senha</h2>
        <p className={styles.description}>
          Crie uma nova senha para acessar sua conta.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className={styles.input}
            />
            <span
              className={styles.icon}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <ul className={styles.passwordRules}>
            <li
              className={temCaractereEspecial ? styles.valid : styles.invalid}
            >
              {temCaractereEspecial ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
              Pelo menos 1 caractere especial (!@#$)
            </li>
            <li className={temLetraMaiuscula ? styles.valid : styles.invalid}>
              {temLetraMaiuscula ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
              Pelo menos 1 letra maiúscula (A-Z)
            </li>
            <li className={tamanhoMinimo ? styles.valid : styles.invalid}>
              {tamanhoMinimo ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
              No mínimo 8 caracteres
            </li>
          </ul>

          <button type="submit" className={styles.saveButton}>
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RedefinirSenha;
