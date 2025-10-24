import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ClienteInterface } from "../../app/models/interfaces/ClienteInterface";
import { RootState } from "../../redux/store";
import { resetCliente, setCliente } from "../../redux/reducers/authReducer";
import { useEffect, useState } from "react";
import { CartItemInterface, clearCart } from "../../redux/reducers/cartReducer";
import { ModalRevisarPedido } from "../../components/ModalRevisarPedido";
import { PagamentoType } from "../../app/models/types/PagamentoType";
import { toast } from "react-toastify";

export const DadosPessoais = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const cliente: ClienteInterface = useSelector(
        (state: RootState) => state.auth.cliente
    );
    const carrinho: CartItemInterface[] = useSelector(
        (state: RootState) => state.cart.cartProdutos
    );
    const lastPath: string = useSelector(
        (state: RootState) => state.app.lastPath
    );

    const [error, setError] = useState("");
    const [formaPagamento, setFormaPagamento] = useState<PagamentoType>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const opcoesPagamento: PagamentoType[] = [
        "Dinheiro",
        "Cartão de Crédito",
        "Cartão de Débito",
        "Pix"
    ];

    // Abre o modal de revisão
    const abrirModal = () => {
        if (!cliente.nome || !cliente.cpf || !cliente.telefone) {
            setError("Preencha todos os dados pessoais!");
            return;
        }
        if (!formaPagamento) {
            setError("Selecione uma forma de pagamento!");
            return;
        }
        setError("");
        setIsModalOpen(true);
    };

    // Confirma o pedido dentro do modal
    const confirmarPedido = () => {
        toast.success("Pedido confirmado!");
        setIsModalOpen(false);
        // Aqui você pode navegar para uma tela de confirmação
        navigate("/");
        dispatch( resetCliente())
        dispatch(clearCart())
    };

    useEffect(() => {
        // Redireciona se carrinho vazio ou se a página anterior não foi o carrinho
        if (!carrinho.length || lastPath !== "/carrinho") {
            navigate("/");
        }
    }, [carrinho, lastPath, navigate]);

    return (
        <div className={styles.container}>
            {/* HEADER */}
            <div className={styles.header}>
                <div
                    className={styles.toBack}
                    onClick={() => navigate("/carrinho")}
                >
                    <ChevronLeft size={32} strokeWidth={2} />
                </div>
                <span>Dados da compra</span>
            </div>

            {/* BODY */}
            <div className={styles.body}>
                <label style={{ fontWeight: "bold", marginBottom: 8, display: "block" }}>
                    Dados pessoais*
                </label>

                <form className={styles.form}>
                    {/* Dados Pessoais */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="">Nome completo</label>
                        <input
                            type="text"
                            placeholder="Nome completo"
                            value={cliente.nome}
                            onChange={(e) =>
                                dispatch(setCliente({ ...cliente, nome: e.target.value }))
                            }
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="">CPF</label>
                        <input
                            type="text"
                            placeholder="CPF"
                            value={cliente.cpf}
                            onChange={(e) =>
                                dispatch(setCliente({ ...cliente, cpf: e.target.value }))
                            }
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="">Telefone</label>
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={cliente.telefone}
                            onChange={(e) =>
                                dispatch(setCliente({ ...cliente, telefone: e.target.value }))
                            }
                        />
                    </div>

                    {/* Forma de Pagamento */}
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontWeight: "bold", marginBottom: 8, display: "block" }}>
                            Forma de pagamento*
                        </label>
                        {opcoesPagamento.map((opcao, idx) => (
                            <label key={idx} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="formaPagamento"
                                    value={opcao}
                                    checked={formaPagamento === opcao}
                                    onChange={() => {
                                        setFormaPagamento(opcao);
                                        setError("");
                                    }}
                                />
                                <span>{opcao}</span>
                            </label>
                        ))}
                    </div>
                </form>

                {error && (
                    <div className={styles.errorMessage}>
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* MODAL DE REVISÃO */}
            <ModalRevisarPedido
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmarPedido}
                cliente={cliente}
                carrinho={carrinho}
                formaPagamento={formaPagamento}
            />

            {/* FOOTER */}
            <div className={styles.footer}>
                <button className={styles.checkoutButton} onClick={abrirModal}>
                    Revisar pedido
                </button>
            </div>
        </div>
    );
};
