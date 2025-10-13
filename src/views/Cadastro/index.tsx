import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    setTimeout(() => navigate("/"), 1500); // volta para a tela de login
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crie sua conta</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {erro && <p style={styles.erro}>{erro}</p>}
          {mensagem && <p style={styles.sucesso}>{mensagem}</p>}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(hoverButton ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHoverButton(true)}
            onMouseLeave={() => setHoverButton(false)}
          >
            Cadastrar
          </button>
        </form>

        {/* Link funcional para voltar ao login */}
        <p style={styles.linkText}>
          Já tem uma conta?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Voltar para Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",       // centraliza horizontalmente
    alignItems: "center",           // centraliza verticalmente
    height: "100vh",
    background: "linear-gradient(135deg, #ff8a00, #e52e71)",
    fontFamily: "Arial, sans-serif",
    padding: "20px",                // espaço extra em telas pequenas
  },
  card: {
    display: "flex",                // torna flex container
    flexDirection: "column",        // itens ficam em coluna
    alignItems: "center",           // centraliza itens horizontalmente
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "400px",              // limita largura do card
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    marginBottom: "25px",
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",                  // faz o form ocupar toda largura do card
    alignItems: "center",           // centraliza horizontalmente
  },
  input: {
    width: "100%",                  // inputs ocupam toda largura do form
    marginBottom: "15px",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",       // padding não quebra a largura
    transition: "all 0.2s ease",
  },
  erro: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
  sucesso: {
    color: "green",
    fontSize: "13px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",                  // botão ocupa toda largura do card
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  linkText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
};

export default Cadastro
