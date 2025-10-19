import React from "react";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

export const SidebarComponent: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <ul>

          {window.innerWidth >= 768 ? 
          // desktop
          <>
            <li onClick={() => {
              navigate("/")
            }}>Gerenciamento de Pedidos</li>
            <li onClick={() => {
              navigate("/login")
            }}>Sair</li>
          </>
            : 
            // mobile
          <>
            <li onClick={() => {
              navigate("/meus-pedidos")
            }}>Meus Pedidos</li>
          </>

          }
        </ul>
      </div>
    </>
  );
};
