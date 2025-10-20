import React from "react";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { DeviceType } from "../../app/models/types/DeviceType";

interface SidebarProps {
  isOpen: boolean;
  device: DeviceType
}

export const SidebarComponent: React.FC<SidebarProps> = ({ isOpen, device }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <ul>

          {device == "desktop" ? 
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
