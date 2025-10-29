import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { HeaderComponent } from "../../components/Header";
import { Users, Fish, Search } from "lucide-react";
import { SidebarComponent } from "../../components/SidebarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import cafeManha from "../../assets/cafe-manha.png";
import almoco from "../../assets/almoco.png";
import jantar from "../../assets/jantar.png";
import doces from "../../assets/doces.png";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { setTimeout } from "timers/promises";
import { UserInterface } from "../../app/models/interfaces/UserInterface";
import { QuantidadeModal } from "../../components/QuantidadeModal/index";
import { addToCart } from "../../redux/reducers/cartReducer";
import { DeviceType } from "../../app/models/types/DeviceType";
import { formatarReal } from "../../utils/formatarReal";
import { setSideBar } from "../../redux/reducers/appReducer";
import axios from "axios";


interface ItemImage {
  id: number;
  imagem: string;
  nome: string;
}

interface produto {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  preco: number;
  categoriaId: number
}

const produtos: produto[] = [
  // Categoria 1 - Café da Manhã
  { id: 1, titulo: "Cappuccino", descricao: "Bebida quente com café espresso e leite vaporizado", url: cafeManha, preco: 9.99, categoriaId: 1 },
  { id: 2, titulo: "Croissant", descricao: "Croissant amanteigado, perfeito para o café da manhã", url: cafeManha, preco: 6.50, categoriaId: 1 },
  { id: 3, titulo: "Pão de Queijo", descricao: "Tradicional pão de queijo mineiro, quentinho e macio", url: cafeManha, preco: 4.50, categoriaId: 1 },
  { id: 4, titulo: "Suco Natural", descricao: "Suco de laranja fresco, 300ml", url: cafeManha, preco: 5.99, categoriaId: 1 },
  { id: 5, titulo: "Omelete", descricao: "Omelete de 2 ovos com queijo e tomate", url: cafeManha, preco: 8.50, categoriaId: 1 },

  // Categoria 2 - Almoço
  { id: 6, titulo: "Frango Grelhado", descricao: "Peito de frango grelhado com legumes ao vapor", url: almoco, preco: 22.99, categoriaId: 2 },
  { id: 7, titulo: "Arroz com Feijão", descricao: "Arroz branco, feijão carioca e salada fresca", url: almoco, preco: 18.50, categoriaId: 2 },
  { id: 8, titulo: "Bife Acebolado", descricao: "Bife bovino acebolado servido com arroz e salada", url: almoco, preco: 25.99, categoriaId: 2 },
  { id: 9, titulo: "Macarrão ao Molho", descricao: "Macarrão ao molho de tomate e manjericão", url: almoco, preco: 20.00, categoriaId: 2 },
  { id: 10, titulo: "Peixe Assado", descricao: "Filé de peixe assado com ervas e legumes", url: almoco, preco: 28.99, categoriaId: 2 },

  // Categoria 3 - Jantar
  { id: 11, titulo: "Sopa de Legumes", descricao: "Sopa quente de legumes frescos", url: jantar, preco: 14.50, categoriaId: 3 },
  { id: 12, titulo: "Risoto de Frango", descricao: "Risoto cremoso com pedaços de frango", url: jantar, preco: 26.99, categoriaId: 3 },
  { id: 13, titulo: "Lasagna", descricao: "Lasagna de carne com queijo gratinado", url: jantar, preco: 29.99, categoriaId: 3 },
  { id: 14, titulo: "Salada Caesar", descricao: "Salada Caesar com frango grelhado", url: jantar, preco: 19.99, categoriaId: 3 },
  { id: 15, titulo: "Strogonoff de Carne", descricao: "Strogonoff servido com arroz branco e batata palha", url: jantar, preco: 27.50, categoriaId: 3 },

  // Categoria 4 - Doces
  { id: 16, titulo: "Brigadeiro", descricao: "Brigadeiro tradicional de chocolate", url: doces, preco: 3.50, categoriaId: 4 },
  { id: 17, titulo: "Beijinho", descricao: "Docinho de coco com cobertura de açúcar", url: doces, preco: 3.50, categoriaId: 4 },
  { id: 18, titulo: "Pudim de Leite", descricao: "Pudim cremoso de leite condensado", url: doces, preco: 7.99, categoriaId: 4 },
  { id: 19, titulo: "Mousse de Maracujá", descricao: "Mousse aerado com calda de maracujá", url: doces, preco: 8.50, categoriaId: 4 },
  { id: 20, titulo: "Brownie", descricao: "Brownie de chocolate com nozes", url: doces, preco: 9.50, categoriaId: 4 },

  // Categoria 5 - Salgados
  { id: 21, titulo: "Coxinha", descricao: "Coxinha de frango com catupiry", url: cafeManha, preco: 5.50, categoriaId: 5 },
  { id: 22, titulo: "Esfiha", descricao: "Esfiha aberta de carne temperada", url: cafeManha, preco: 6.00, categoriaId: 5 },
  { id: 23, titulo: "Kibe", descricao: "Kibe frito com recheio de carne", url: cafeManha, preco: 5.99, categoriaId: 5 },
  { id: 24, titulo: "Pastel de Queijo", descricao: "Pastel crocante com recheio de queijo", url: cafeManha, preco: 6.50, categoriaId: 5 },
  { id: 25, titulo: "Empada de Frango", descricao: "Empada recheada com frango desfiado", url: cafeManha, preco: 7.00, categoriaId: 5 },

  // Categoria 6 - Sobremesas
  { id: 26, titulo: "Sorvete", descricao: "Sorvete de creme em pote individual", url: almoco, preco: 6.99, categoriaId: 6 },
  { id: 27, titulo: "Torta de Limão", descricao: "Torta de limão com base crocante", url: almoco, preco: 12.99, categoriaId: 6 },
  { id: 28, titulo: "Cheesecake", descricao: "Cheesecake com cobertura de frutas vermelhas", url: almoco, preco: 14.50, categoriaId: 6 },
  { id: 29, titulo: "Pavê", descricao: "Pavê de chocolate com creme", url: almoco, preco: 11.99, categoriaId: 6 },
  { id: 30, titulo: "Petit Gateau", descricao: "Petit Gateau de chocolate com sorvete", url: almoco, preco: 16.50, categoriaId: 6 },
];




export const HomeView = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);
  const [categotiaSelecionada, setCategoriaSelecionada] = useState<ItemImage>();
  const [produtosLista, setProdutosLista] = useState<produto[]>(produtos.filter((produto) => { return produto.categoriaId == 1 }));
  const [produtoSelecionado, setProdutoSelecionado] = useState<produto | null>(null);
  const user: UserInterface = useSelector(
    (state: RootState) => state.auth.user
  );
  const [categorias, setCategorias] = useState<ItemImage[]>()

  const [device, setDevice] = useState<DeviceType>(undefined)

  const mostrarNotificacao = () => {
    toast.success("Operação concluída com sucesso!");
  };

  useEffect(() => {
    // const notificarCliente = () => {
    //   toast.success("Pedido #12345 pronto! Retire no balcão.");
    // };

    const buscarCategorias = async () => {
      try {
        const response = await axios.get("https://sistema-pedidos-gestao-api.onrender.com/categoria/buscar-categorias")
        if (response.status === 200) {
          setCategorias(response.data)
        }
      } catch (error) {

      }
    }



    if (window.innerWidth >= 768) {
      setDevice("desktop")
      // if (!user.logado) {
      //   toast.info("Sessão encerrada! Faça login novamente.");

      //   setInterval(() => {
      //     navigate("/login")
      //   }, 1000);

      // }
    } else {
      setDevice("mobile")
    }

    // notificarCliente();

    // const intervalo = setInterval(() => {
    //   notificarCliente();
    // }, 6000);

    // return () => clearInterval(intervalo);
    buscarCategorias()
  }, [user]);

  const selecionarCategoria = (item: ItemImage) => {
    setCategoriaSelecionada(item);
    const produtosFiltrados = produtos.filter((produto) => {
      return produto.categoriaId == item.id
    })
    console.log("produtos: ", produtosFiltrados)
    setProdutosLista(produtosFiltrados);
  }

  const handleConfirmar = (quantidade: number) => {
    if (!produtoSelecionado) return;
    dispatch(
      addToCart({
        id: produtoSelecionado.id,
        titulo: produtoSelecionado.titulo,
        preco: produtoSelecionado.preco,
        descricao: produtoSelecionado.descricao,
        quantidade,
        url: produtoSelecionado.url,
      })
    );
    toast.success("Produto adicionado ao carrinho!");
    setProdutoSelecionado(null);
  };

  const buscarProduto = (descricao: string) => {
    // Função para normalizar texto (remove acento e coloca tudo minúsculo)
    const normalizar = (texto: string) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const termo = normalizar(descricao);

    // Se o campo estiver vazio, volta a lista completa
    if (!termo.trim()) {
      setProdutosLista(produtos.filter((produto) => { return produto.categoriaId == categotiaSelecionada?.id })); // supondo que você tenha guardado a lista original
      return;
    }

    // Filtro por parte da palavra (sem diferenciar acento ou maiúscula)
    const resultado = produtosLista.filter((item) => {
      const tituloNormalizado = normalizar(item.titulo);
      const descricaoNormalizada = normalizar(item.descricao || "");
      return (
        tituloNormalizado.includes(termo) ||
        descricaoNormalizada.includes(termo)
      );
    });

    setProdutosLista(resultado);
  };



  return (
    <div className={styles.container}>

      <HeaderComponent device={device} />
      <div className={styles.containerBox}>
        <SidebarComponent
          isOpen={isSidebarOpen}
          onClose={() => dispatch(setSideBar(false))}
          device={device}
        />

        {device == "mobile" ?
          <>
            <div className={styles.inputGroup}>
              <input
                type="text"
                onFocus={() => { }}
                onChange={(e) => {
                  buscarProduto(e.target.value)
                }}
                placeholder="Buscar produto"
                className={styles.input}
              />
            </div>

            {categorias &&
              <div className={styles.containerItens}>
                {categorias?.map((item) => (
                  <div
                    key={item.id}
                    className={styles.containerItem}
                    style={{ backgroundImage: `url(${item?.imagem})` }}
                    onClick={() => selecionarCategoria(item)}
                  >
                    <span className={styles.itemText}>{item?.nome}</span>
                  </div>
                ))}
              </div>
            }


            <div>
              <div style={{
                marginTop: "20px",
                marginBottom: "8px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                paddingLeft: "16px"
              }}>{categotiaSelecionada?.nome}</div>


              <div className={styles.produtosWrapper}>
                <div className={styles.produtosContainer}>
                  {produtosLista.map((item) => (
                    <div
                      key={item.id}
                      className={styles.produtoCard}
                      onClick={() => setProdutoSelecionado(item)}
                    >
                      <img
                        src={item.url}
                        alt={item.titulo}
                        className={styles.produtoImagem}
                      />

                      <div className={styles.produtoInfo}>
                        <h3 className={styles.produtoTitulo}>{item.titulo}</h3>
                        <p className={styles.produtoDescricao}>{item.descricao}</p>
                        <p className={styles.produtoPreco}>{formatarReal(item.preco)}</p>
                      </div>
                    </div>
                  ))}

                  {produtoSelecionado && (
                    <QuantidadeModal
                      produto={produtoSelecionado}
                      onConfirm={handleConfirmar}
                      onClose={() => setProdutoSelecionado(null)}
                    />
                  )}
                </div>
              </div>

            </div>
          </>

          : "Tela de desktop"}
      </div>
    </div>
  );
};
