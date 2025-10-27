import React from "react";
import styles from "./index.module.css";
import { CartItemInterface } from "../../redux/reducers/cartReducer";
import { ClienteInterface } from "../../app/models/interfaces/ClienteInterface";
import { formatarReal } from "../../utils/formatarReal";
import { PagamentoType } from "../../app/models/types/PagamentoType";
import { useNavigate } from "react-router-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cliente: ClienteInterface;
    carrinho: CartItemInterface[];
    formaPagamento: PagamentoType;
}

export const ModalRevisarPedido: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    cliente,
    carrinho,
    formaPagamento
}) => {
    if (!isOpen) return null;

    const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Revisar Pedido</h2>

                <section className={styles.section}>
                    <h3>Dados Pessoais</h3>
                    <p><strong>Nome:</strong> {cliente.nome}</p>
                    <p><strong>CPF:</strong> {cliente.cpf}</p>
                    <p><strong>Telefone:</strong> {cliente.telefone}</p>
                </section>

                <section className={styles.section}>
                    <h3>Forma de Pagamento</h3>
                    <p>{formaPagamento}</p>
                </section>

                <section className={styles.section}>
                    <h3>Produtos</h3>
                    <div className={styles.produtos}>
                        {carrinho.map(item => (
                            <div key={item.id} className={styles.produto}>
                                <span>{item.titulo}</span>
                                <span>{item.quantidade} x {formatarReal(item.preco)}</span>
                                <span>{formatarReal(item.quantidade * item.preco)}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.total}>
                        <strong>Total:</strong>
                        <span>{formatarReal(total)}</span>
                    </div>
                </section>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                    <button className={styles.confirmButton}
                        onClick={onConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};
