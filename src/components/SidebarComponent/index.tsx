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
          <li onClick={() => {
            navigate("/meus-pedidos")
          }}>Meus Pedidos</li>
          <li onClick={() => {
            navigate("/login")
          }}>Sair</li>
        </ul>
      </div>
    </>
  );
};
