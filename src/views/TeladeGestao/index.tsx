import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, Package, BarChart3 } from "lucide-react";
import styles from "./index.module.css";
import logo from "../../assets/logo.png";

export const TeladeGestao = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.page}>
   
      {menuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          ☰
        </div>
        <img src={logo} alt="Logo" className={styles.logo} />
      </header>

      {/* MENU LATERAL */}
      <nav className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
        <ul>
          <li onClick={() => { navigate("/"); closeMenu(); }}>Início</li>
          <li onClick={() => { navigate("/login"); closeMenu(); }}>Sair</li>
        </ul>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.container}>
     

        <div className={styles.modulesGrid}>
          <div
            className={styles.moduleCard}
            onClick={() => navigate("/gerenciamento-pedidos")}
          >
            <ClipboardList className={styles.icon} />
            <span>Gestão de Pedidos</span>
          </div>

          <div
            className={styles.moduleCard}
            onClick={() => navigate("/gerenciamento-cadastro")}
          >
            <Users className={styles.icon} />
            <span>Gestão de Cadastro</span>
          </div>

          <div
            className={styles.moduleCard}
            onClick={() => navigate("/gerenciamento-produtos")}
          >
            <Package className={styles.icon} />
            <span>Gestão de Produtos</span>
          </div>

          <div
            className={styles.moduleCard}
            onClick={() => navigate("/relatorios")}
          >
            <BarChart3 className={styles.icon} />
            <span>Relatórios</span>
          </div>
        </div>
      </main>
    </div>
  );
};
