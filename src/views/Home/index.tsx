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

const itens: ItemImage[] = [
  {
    id: 1,
    imagem: cafeManha,
    nome: "Café da Manhã"
  },
  {
    id: 2,
    imagem: almoco,
    nome: "Almoço"
  },
  {
    id: 3,
    imagem: jantar,
    nome: "Jantar"
  },
  {
    id: 4,
    imagem: doces,
    nome: "Doces"
  },
  {
    id: 5,
    imagem: cafeManha,
    nome: "Salgados"
  },
  {
    id: 6,
    imagem: cafeManha,
    nome: "Sobremesas"
  }
]

const produtos: produto[] = [
  {
    id: 1,
    titulo: "produto 1",
    descricao: "Aqui vai a descricao do produto",
    url: cafeManha,
    preco: 29.99,
    categoriaId: 1
  },
  {
    id: 2,
    titulo: "produto 2",
    descricao: "Aqui vai a descricao do produto",
    url: almoco,
    preco: 29.99,
    categoriaId: 2
  },
  {
    id: 3,
    titulo: "produto 3",
    descricao: "Aqui vai a descricao do produto",
    url: jantar,
    preco: 29.99,
    categoriaId: 3
  },
  {
    id: 4,
    titulo: "produto 4",
    descricao: "Aqui vai a descricao do produto",
    url: doces,
    preco: 29.99,
    categoriaId: 4
  },
  {
    id: 5,
    titulo: "produto 5",
    descricao: "Aqui vai a descricao do produto",
    url: jantar,
    preco: 29.99,
    categoriaId: 5
  },
  {
    id: 6,
    titulo: "produto 6",
    descricao: "Aqui vai a descricao do produto",
    url: almoco,
    preco: 29.99,
    categoriaId: 6
  }
]



export const HomeView = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);
  const [categotiaSelecionada, setCategoriaSelecionada] = useState<ItemImage>(itens[0]);
  const [produtosLista, setProdutosLista] = useState<produto[]>(produtos.filter((produto) => { return produto.categoriaId == 1 }));
  const [produtoSelecionado, setProdutoSelecionado] = useState<produto | null>(null);
  const user: UserInterface = useSelector(
    (state: RootState) => state.auth.user
  );

  const mostrarNotificacao = () => {
    toast.success("Operação concluída com sucesso!");
  };

  // useEffect(() => {
  //   const notificarCliente = () => {
  //     toast.success("Pedido #12345 pronto! Retire no balcão.");
  //   };

  //   if (!user.logado) {
  //     toast.info("Sessão encerrada! Faça login novamente.");

  //     setInterval(() => {
  //        navigate("/login")
  //     }, 1000);

  //   }

  //   // notificarCliente();

  //   // const intervalo = setInterval(() => {
  //   //   notificarCliente();
  //   // }, 6000);

  //   // return () => clearInterval(intervalo);
  // }, [user]);

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


  return (
    <div className={styles.container}>

      <HeaderComponent />
      <div className={styles.containerBox}>
        <SidebarComponent
          isOpen={isSidebarOpen}
        />
        <div className={styles.inputGroup}>
          <input
            type="text"
            onFocus={() => { }}
            onChange={(e) => { }}
            placeholder="Buscar produto"
            className={styles.input}
          />
          <button className={styles.button}>
            <Search size={24} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.containerItens}>
          {
            itens.map((item) => (
              <div key={item.id} className={styles.containerItem} style={{ backgroundImage: `url(${item.imagem})` }} onClick={() => {
                selecionarCategoria(item);
              }}>
                <span className={styles.itemText}>{item.nome}</span>
              </div>
            ))
          }
        </div>

        <div>
          <div style={{
            marginTop: "20px",
            fontSize: "1.2rem",
            fontWeight: "bold"
          }}>{categotiaSelecionada!.nome}</div>
          <div className={styles.listaProdutos}>
            {produtosLista.map((produto) => (
              <div
                key={produto.id}
                className={styles.produto}
                onClick={() => setProdutoSelecionado(produto)}
              >
                <div
                  className={styles.produtoImage}
                  style={{ backgroundImage: `url(${produto.url})` }}
                ></div>
                <div className={styles.produtoInfo}>
                  <div>{produto.titulo}</div>
                  <div>{produto.descricao}</div>
                  <div>R$ {produto.preco.toFixed(2)}</div>
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
    </div>
  );
};
