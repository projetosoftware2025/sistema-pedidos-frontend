import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [hoverButton, setHoverButton] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem!");
      setMensagem("");
      return;
    }

    if (!formData.nome || !formData.email || !formData.cpf || !formData.senha) {
      setErro("Preencha todos os campos!");
      setMensagem("");
      return;
    }

    console.log("Dados enviados:", formData);

    setErro("");
    setMensagem("Cadastro realizado com sucesso!");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Crie sua conta</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            className={styles.input}
            required
          />

          {erro && <p className={styles.erro}>{erro}</p>}
          {mensagem && <p className={styles.sucesso}>{mensagem}</p>}

          <button
            type="submit"
            className={`${styles.button} ${hoverButton ? styles.buttonHover : ""}`}
            onMouseEnter={() => setHoverButton(true)}
            onMouseLeave={() => setHoverButton(false)}
          >
            Cadastrar
          </button>
        </form>

        <p className={styles.linkText}>
          Já tem uma conta?{" "}
          <span
            className={styles.link}
            onClick={() => navigate("/login")}
          >
            Voltar para Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
