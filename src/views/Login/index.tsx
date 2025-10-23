import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, Eye, EyeOff } from "lucide-react";
import styles from './index.module.css';
import logo from '../../assets/logo.png';
import background from '../../assets/background.png';
import { URL_BASE } from '../../utils/constants';
import axios from 'axios';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [error, setError] = useState('');

   const handleLogin = async (email: string, senha: string) => {
    try {
      const response = await axios.post(`${URL_BASE}/usuario/login`, {
        email,
        senha
      });

      if (response.status === 200) {
        //login realizado com sucesso
        const token = response.data.token; // API retorna token
        localStorage.setItem('token', token); // salva token no localStorage
        navigate('/'); // redireciona para a página principal
      } else {
        setError('Usuário ou senha incorretos');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.mensagem) {
        setError(err.response.data.mensagem);
      } else {
        setError('Erro ao conectar com o servidor');
      }
    }
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.containerLogin}>
        <img src={logo} alt="Logo SuculentuS" className={styles.logo} />

        <div className={styles.header}>
          <User size={28} strokeWidth={3} /> Login
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(usuario, senha);
          }}
        >
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={usuario}
              onFocus={() => setError('')}
              onChange={(e) => setUsuario(e.target.value)}
              className={error ? styles.inputError : ''}
              placeholder="E-mail"
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
            onClick={() => navigate('/cadastro')}
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
};
