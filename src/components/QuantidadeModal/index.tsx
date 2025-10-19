import React, { useState } from "react";
import styles from "./index.module.css";

interface QuantidadeModalProps {
  produto: {
    id: number;
    titulo: string;
    preco: number;
    url: string;
  };
  onConfirm: (quantidade: number) => void;
  onClose: () => void;
}

export const QuantidadeModal: React.FC<QuantidadeModalProps> = ({
  produto,
  onConfirm,
  onClose,
}) => {
  const [quantidade, setQuantidade] = useState(1);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{produto.titulo}</h3>
        <img src={produto.url} alt={produto.titulo} />
        <p>Preço: R$ {produto.preco.toFixed(2)}</p>

        <div className={styles.controls}>
          <button
            onClick={() =>
              setQuantidade((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            -
          </button>
          <span>{quantidade}</span>
          <button onClick={() => setQuantidade((prev) => prev + 1)}>+</button>
        </div>

        <div className={styles.actions}>
          <button onClick={() => onConfirm(quantidade)}>Adicionar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
