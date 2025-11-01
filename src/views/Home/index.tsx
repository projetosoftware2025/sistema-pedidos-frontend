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
import { URL_API_GESTAO } from "../../utils/constants";


interface ItemImage {
  id: number;
  imagem: string;
  descricao: string;
}

interface produto {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  preco: number;
  categoriaId: number
}

export const HomeView = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);
  const [categotiaSelecionada, setCategoriaSelecionada] = useState<ItemImage>();
  const [produtosLista, setProdutosLista] = useState<produto[]>();
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
        const response = await axios.get(`}/categoria/buscar-categorias`)
        if (response.status === 200) {
          setCategoriaSelecionada(response.data[0])
          setCategorias(response.data)
        }
      } catch (error) {

      }
    }

    const buscarProdutos = async () => {
      try {
        const response = await axios.get(`}/produto/buscar-produtos`)
        if (response.status === 200) {
          setProdutosLista(response.data)
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
    buscarProdutos();
  }, [user]);

  const selecionarCategoria = (item: ItemImage) => {
    setCategoriaSelecionada(item);
    const produtosFiltrados = produtosLista?.filter((produto) => {
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
      setProdutosLista(produtosLista?.filter((produto) => { return produto.categoriaId == categotiaSelecionada?.id })); // supondo que você tenha guardado a lista original
      return;
    }

    // Filtro por parte da palavra (sem diferenciar acento ou maiúscula)
    const resultado = produtosLista?.filter((item) => {
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
                    style={{ backgroundImage: `url(${URL_API_GESTAO}/categoria/imagem/${item.id})` }}
                    onClick={() => selecionarCategoria(item)}
                  >
                    <span className={styles.itemText}>{item?.descricao}</span>
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
              }}>{categotiaSelecionada?.descricao}</div>


              {produtosLista &&
                <div className={styles.produtosWrapper}>
                  <div className={styles.produtosContainer}>
                    {produtosLista?.map((item) => (
                      <div
                        key={item.id}
                        className={styles.produtoCard}
                        onClick={() => setProdutoSelecionado(item)}
                      >
                        <img
                          src={`${URL_API_GESTAO}/produto/imagem/${item.id}`}
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
              }

            </div>
          </>

          : "Tela de desktop"}
      </div>
    </div>
  );
};
