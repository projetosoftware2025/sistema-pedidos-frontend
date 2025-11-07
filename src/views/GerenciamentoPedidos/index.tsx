import React, { useState, useMemo, useEffect } from "react";
import styles from "./index.module.css";
import { HeaderComponent } from "../../components/Header";
import { SidebarComponent } from "../../components/SidebarComponent";
import { setSideBar } from "../../redux/reducers/appReducer";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";


interface Produto {
  id: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  numero: string;
  cliente: string;
  cpf: string;
  dtPedido: string;
  dtFInalizacao: string | null;
  dtCancelamento: string | null;
  formaPagamento: string;
  status: string;
}

type StatusType = "Andamento" | "Cancelado" | "Finalizado" | "Pronto" | ""

interface FiltroInterface {
  campo: string;
  dataInicial: string | null; // formato "YYYY-MM-DD"
  dataFinal: string | null;
  status: StatusType;
}

export default function GerenciamentoPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>();
  const dispatch = useDispatch()
  const hoje = new Date();
  const tresDiasAtras = new Date();
  tresDiasAtras.setDate(hoje.getDate() - 3);

  // formatar para "YYYY-MM-DD"
  const formatarData = (data: Date) => data.toISOString().split("T")[0];

  const [filtro, setFiltro] = useState<FiltroInterface>({
    campo: "",
    dataInicial: formatarData(tresDiasAtras),
    dataFinal: formatarData(hoje),
    status: "",
  });

  const [menuAtivo, setMenuAtivo] = useState<number>();
  const [detalhePedido, setDetalhePedido] = useState<Pedido | null>(null);
  const [pedidoCancelamento, setPedidoCancelamento] = useState<Pedido | null>(null);
  const [motivo, setMotivo] = useState("");
  const [pedidoPix, setPedidoPix] = useState<Pedido | null>(null); // usado para exibir o modal do comprovante
  const [confirmar, setConfirmar] = useState<"confirmar" | "recusar" | null>(null);
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);

  // === Fecha o menu ao clicar fora ===
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(`.${styles.infoButton}`) &&
        !target.closest(`.${styles.menu}`)
      ) {
        setMenuAtivo(0);
      }
    };

    document.addEventListener("click", handleClickFora);
    return () => document.removeEventListener("click", handleClickFora);
  }, []);

  // useEffect(() => {
  //   const buscarPedidos = async () => {
  //     try {
  //       const response = await axios.get(`https://sistema-pedidos-gestao-api.onrender.com/pedido/buscar-pedidos?dtInicio=${filtro.dataInicial}&dtFim=${filtro.dataFinal}`)
  //       if (response.data && response.status == 200) {
  //         setPedidos(response.data)
  //       } else if (response.status == 404) {
  //         toast.error("Pedidos não encotrados!")
  //       } else {
  //         toast.error("Pedidos não encotrados!")
  //       }
  //     } catch (error) {
  //       toast.error("Pedidos não encotrados!")
  //     }
  //   };
  //   buscarPedidos();

  // }, [filtro.dataInicial, filtro.dataFinal]);

  useEffect(() => {
    const handleClickForaModal = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (detalhePedido && target.classList.contains(styles.modal)) setDetalhePedido(null);
      if (pedidoCancelamento && target.classList.contains(styles.modal))
        setPedidoCancelamento(null);
      if (pedidoPix && target.classList.contains(styles.modal)) setPedidoPix(null);
      if (confirmar && target.classList.contains(styles.modal)) setConfirmar(null);
    };

    document.addEventListener("click", handleClickForaModal);
    return () => document.removeEventListener("click", handleClickForaModal);
  }, [detalhePedido, pedidoCancelamento, pedidoPix, confirmar]);

  const calcularTotal = (produtos: Produto[]) =>
    produtos.reduce((acc, p) => acc + p.valorUnitario * p.quantidade, 0);

  const buscarPedidos = async () => {
    try {
      const response = await axios.get(`https://sistema-pedidos-gestao-api.onrender.com/pedido/buscar-pedidos?dtInicio=${filtro.dataInicial}&dtFim=${filtro.dataFinal}`)
      if (response.data && response.status == 200) {
        setPedidos(response.data)
      } else if (response.status == 404) {
        toast.error("Pedidos não encotrados!")
      } else {
        toast.error("Pedidos não encotrados!")
      }
    } catch (error) {
      toast.error("Pedidos não encotrados!")
    }
  };

  return (
    <div className={styles.container}>
      <HeaderComponent device="desktop" />

      <div className={styles.containerBox}>
        <SidebarComponent
          isOpen={isSidebarOpen}
          onClose={() => dispatch(setSideBar(false))}
          device={"desktop"}
        />

        <div className={styles.filters}>
          <h1 className={styles.title}>Gerenciamento de Pedidos</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // evita reload
            }}
          >
            <input
              placeholder="Nome ou CPF"
              value={filtro.campo}
              onChange={(e) => setFiltro({ ...filtro, campo: e.target.value })}
            />

            <input
              type="date"
              value={filtro.dataInicial ?? ""}
              onChange={(e) => setFiltro({ ...filtro, dataInicial: e.target.value })}
            />

            <input
              type="date"
              value={filtro.dataFinal ?? ""}
              onChange={(e) => setFiltro({ ...filtro, dataFinal: e.target.value })}
            />

            <select
              value={filtro.status}
              onChange={(e) => setFiltro({ ...filtro, status: e.target.value as StatusType })}
            >
              <option value="">Status</option>
              <option value="Andamento">Andamento</option>
              <option value="Pronto">Pronto</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <button className={styles.buscar} onClick={buscarPedidos}>Buscar</button>
          </form>


        </div>

        {/* TABELA */}
        {pedidos?.length ? <table className={styles.table}>
          <thead>
            <tr>
              <th>N°</th>
              <th>Cliente</th>
              <th>CPF</th>
              <th>Data do pedido</th>
              <th>Forma de pagamento</th>
              {/* <th>Qtd</th>
              <th>Valor</th> */}
              <th>Status</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {pedidos?.map((p) => (
              <tr key={p.numero}>
                <td>{p.numero}</td>
                <td>{p.cliente}</td>
                <td>{p.cpf}</td>
                <td>
                  {new Date(p.dtPedido).toLocaleDateString()}{" "}
                  {new Date(p.dtPedido).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td>{p.formaPagamento}</td>
                {/* <td>{p.produtos.length}</td> */}
                {/* <td>R$ {calcularTotal(p.produtos).toFixed(2)}</td> */}
                <td>
                  <span className={`${styles.status} ${styles[p.status]}`}>
                    {p.status === "A"
                      ? "Andamento"
                      : p.status === "P"
                        ? "Pronto"
                        : p.status === "F"
                          ? "Concluído"
                          : "Cancelado"}
                  </span>
                </td>

                {/* ======= MENU DE OPÇÕES ======= */}
                <td className={styles.acoes}>
                  <button
                    className={styles.infoButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuAtivo(menuAtivo === p.id ? 0 : p.id);
                    }}
                  >
                    i
                  </button>

                  {menuAtivo === p.id && (
                    <div className={styles.menu}>
                      <button onClick={() => setDetalhePedido(p)}>Visualizar pedido</button>
                      <button>Chamar cliente</button>

                      {/* === BOTÃO "Visualizar comprovante" ===
                        Define o estado `pedidoPix` como o pedido selecionado,
                        fazendo aparecer o modal Pix logo abaixo. */}
                      <button onClick={() => setPedidoPix(p)}>Visualizar comprovante</button>

                      <button
                        className={styles.cancelar}
                        onClick={() => setPedidoCancelamento(p)}
                      >
                        Cancelar pedido
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table> :
          <div>

          </div>
        }

        {/* {detalhePedido && (
          <div className={styles.modal}>
            <div className={styles.card}>
              <h2>Detalhes do pedido Nº {detalhePedido.numero}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {detalhePedido.produtos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.quantidade}</td>
                      <td>R$ {p.valorUnitario.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3>Valor total: R$ {calcularTotal(detalhePedido.produtos).toFixed(2)}</h3>
              <div className={styles.actions}>
                <button onClick={() => setDetalhePedido(null)}>Voltar</button>
              </div>
            </div>
          </div>
        )} */}

        {/* MODAL CANCELAMENTO */}
        {pedidoCancelamento && (
          <div className={styles.modal}>
            <div className={styles.card}>
              <h2>Cancelar pedido Nº {pedidoCancelamento.numero}</h2>
              <textarea
                placeholder="Insira aqui o motivo do cancelamento"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              <div className={styles.actions}>
                <button onClick={() => setPedidoCancelamento(null)}>Voltar</button>
                <button
                  className={styles.enviar}
                // onClick={() => atualizarStatus(pedidoCancelamento.numero, "Cancelado")}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {pedidoPix && (
          <div className={styles.modal}>
            <div className={styles.card}>
              <h2>Comprovante Pix</h2>
              <p>Pedido Nº {pedidoPix.numero}</p>

              {/* Caixa onde o comprovante Pix pode ser exibido */}
              <div className={styles.pixBox}></div>

              <div className={styles.actions}>
                <button className={styles.recusar} onClick={() => setConfirmar("recusar")}>
                  Recusar pagamento
                </button>
                <button className={styles.confirmar} onClick={() => setConfirmar("confirmar")}>
                  Confirmar pagamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRMAR/RECUSAR PIX */}
        {confirmar && (
          <div className={styles.modal}>
            <div className={styles.alert}>
              <h3>
                {confirmar === "confirmar" ? "Confirmar pagamento" : "Recusar comprovante"}
              </h3>
              <p>Você tem certeza que deseja {confirmar} este pagamento?</p>
              <div className={styles.actions}>
                <button onClick={() => setConfirmar(null)}>Voltar</button>
                <button
                  className={confirmar === "confirmar" ? styles.confirmar : styles.recusar}
                  onClick={() => {
                    setConfirmar(null);
                    setPedidoPix(null);
                  }}
                >
                  {confirmar === "confirmar" ? "Confirmar" : "Recusar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>



    </div>
  );
}
