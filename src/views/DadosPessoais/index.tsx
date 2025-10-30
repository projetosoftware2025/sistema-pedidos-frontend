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
import axios from "axios";

interface DadosInterface {
    cliente: string;
    cpf: string;
    telefone: string;
    formaPagamento: PagamentoType;
}


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
    const [formData, setFormData] = useState<DadosInterface>({
        cliente: "",
        cpf: "",
        telefone: "",
        formaPagamento: "Dinheiro"
    });

    const opcoesPagamento: PagamentoType[] = [
        "Dinheiro",
        "Cartão de Crédito",
        "Cartão de Débito",
        "Pix"
    ];

    // Abre o modal de revisão
    const abrirModal = () => {
        console.log("formData modal: ", formData)
        if (!formData.cliente || !formData.cpf || !formData.telefone) {
            setError("Preencha todos os dados pessoais!");
            return;
        }
        // if (!formaPagamento) {
        //     setError("Selecione uma forma de pagamento!");
        //     return;
        // }
        setError("");
        setIsModalOpen(true);
    };

    // Confirma o pedido dentro do modal
    const confirmarItensPedido = async (
        idPedido: number,
        cart: CartItemInterface[]
    ) => {
        // Verifica se há itens para processar
        if (cart.length === 0) {
            return; // Nada a fazer
        }

        // 1. Mapeia cada item do carrinho para uma Promise de requisição POST
        const itemRequests = cart.map((item) => {
            // Constrói o corpo da requisição conforme o modelo da API de itens
            const itemPayload = {
                idPedido: idPedido,
                idProduto: item.id,
                titulo: item.titulo,
                valorUnitario: item.preco,
                quantidade: item.quantidade,
            };

            // **URL CORRIGIDA**: Use a URL completa para evitar erros de ambiente
            return axios.post("http://localhost:8080/itens-pedido/cadastrar", itemPayload);
        });

        // 2. Executa todas as requisições em paralelo
        // Se uma falhar, Promise.all lança um erro e a execução do try/catch para.
        await Promise.all(itemRequests);
    };


    // -----------------------------------------------------------------
    // FUNÇÃO 1: CRIA O PEDIDO PRINCIPAL E CHAMA O CADASTRO DOS ITENS
    // -----------------------------------------------------------------
    const confirmarPedido = async (cart: CartItemInterface[]) => {

        // **Ajuste:** É melhor usar 'carrinho' diretamente, se estiver no escopo. 
        // Assumindo que 'cart' é um parâmetro redundante ou igual a 'carrinho'.
        const currentCart = carrinho;

        if (!formData.cliente || !formData.cpf || !formData.formaPagamento || !formData.telefone) {
            setError("Informe todos os dados do cliente!");
            return;
        }

        if (currentCart.length === 0) {
            setError("O carrinho está vazio! Adicione itens ao pedido.");
            return;
        }

        let pedidoId; // Variável para armazenar o ID do pedido principal

        // 1. CRIAÇÃO DO PEDIDO PRINCIPAL
        try {
            console.log("Enviando dados do pedido principal: ", formData);

            const response = await axios.post("http://localhost:8080/pedido/cadastrar", formData);

            if (response.status !== 200 && response.status !== 201) {
                // Se o status for diferente de 200 ou 201 (Created), lança um erro
                throw new Error(`Falha na criação do pedido principal. Status: ${response.status}`);
            }

            // ⚠️ Assume que a API retorna o ID do novo pedido em response.data.id
            pedidoId = response.data.id;

        } catch (error) {
            console.error("Erro na Criação do Pedido Principal:", error);
            toast.error("Erro ao criar o pedido principal. Tente novamente!");
            return; // Interrompe se o pedido principal falhar
        }

        // 2. CADASTRO DOS ITENS DO PEDIDO
        if (pedidoId) {
            try {
                // Chamando a função de itens com o ID do Pedido e o Carrinho
                await confirmarItensPedido(pedidoId, currentCart);

                // 3. LÓGICA DE SUCESSO FINAL
                toast.success("Pedido efetuado com sucesso!");

                // Limpeza e navegação
                setIsModalOpen(false);
                navigate("/");
                dispatch(resetCliente());
                dispatch(clearCart());

            } catch (error) {
                console.error("Erro ao cadastrar um ou mais itens do pedido:", error);
                toast.error("Pedido principal criado, mas houve falha ao cadastrar os itens! Contate o suporte.");
            }
        }
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
                            value={formData?.cliente}
                            onChange={(e) =>
                                setFormData({ ...formData, cliente: e.target.value })
                            }

                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="">CPF</label>
                        <input
                            type="text"
                            placeholder="CPF"
                            value={formData?.cpf}
                            onChange={(e) =>
                                setFormData({ ...formData, cpf: e.target.value })
                            }
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="">Telefone</label>
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={formData?.telefone}
                            onChange={(e) =>
                                setFormData({ ...formData, telefone: e.target.value })
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
                                    onChange={(e) =>
                                        setFormData({ ...formData, formaPagamento: opcao })
                                    }
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
                onConfirm={() => { confirmarPedido(carrinho) }}
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
