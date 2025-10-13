import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Eye, EyeOff } from "lucide-react";
import styles from './index.module.css';

export const LoginView: React.FC = () => {
  const navigate = useNavigate(); // ✅ useNavigate dentro do componente
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!usuario || !senha) {
      setError('Preencha usuário e senha');
      return;
    }
    // Simulação de login
    console.log('Login:', { usuario, senha });
    navigate('/home'); // Navega para a home após login
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLogin}>
        <div className={styles.header}>
          <User size={28} strokeWidth={3} /> Login
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={usuario}
              onFocus={() => setError('')}
              onChange={(e) => setUsuario(e.target.value)}
              className={error ? styles.inputError : ''}
              placeholder="Usuário"
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type={senhaVisivel ? 'text' : 'password'}
              value={senha}
              onFocus={() => setError('')}
              onChange={(e) => setSenha(e.target.value)}
              className={error ? styles.inputError : ''}
              placeholder="Senha"
            />
            <span
              className={styles.showPasswordIcon}
              onClick={() => setSenhaVisivel(!senhaVisivel)}
            >
              {senhaVisivel ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>

        <div className={styles.footer}>
          <span>Não tem conta?</span>
          <button
            type="button"
            className={styles.registerButton}
            onClick={() => navigate('/cadastro')} // ✅ Navega para a tela de cadastro
          >
            Criar Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};
