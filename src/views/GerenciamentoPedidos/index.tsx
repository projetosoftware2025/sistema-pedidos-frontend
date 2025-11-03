import React, { useState, useMemo, useEffect } from "react";
import styles from "./index.module.css";

type Status = "andamento" | "pronto" | "finalizado" | "cancelado";

interface Produto {
  id: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
}

interface Pedido {
  numero: string;
  nomeCliente: string;
  cpfCliente: string;
  data: string;
  formaPagamento: string;
  produtos: Produto[];
  status: Status;
  comprovantePixUrl?: string | null;
  motivoCancelamento?: string | null;
}

const PEDIDOS_EXEMPLO: Pedido[] = [
  {
    numero: "1293",
    nomeCliente: "Amanda Silva",
    cpfCliente: "123.456.189-10",
    data: "2025-10-27T14:30:00",
    formaPagamento: "Pix",
    produtos: [{ id: "1", nome: "Café expresso", valorUnitario: 6.99, quantidade: 1 }],
    status: "andamento",
  },
  {
    numero: "2344",
    nomeCliente: "João Artur",
    cpfCliente: "678.910.111-21",
    data: "2025-10-27T15:00:00",
    formaPagamento: "Débito",
    produtos: [{ id: "2", nome: "Tapioca c/ ovo", valorUnitario: 6.99, quantidade: 1 }],
    status: "andamento",
  },
  {
    numero: "4959",
    nomeCliente: "Márcio Viana",
    cpfCliente: "161.718.192-01",
    data: "2025-10-27T15:30:00",
    formaPagamento: "Débito",
    produtos: [{ id: "3", nome: "Coxinha", valorUnitario: 6.99, quantidade: 1 }],
    status: "pronto",
  },
  {
    numero: "1340",
    nomeCliente: "Enzo Ferreira",
    cpfCliente: "252.627.282-90",
    data: "2025-10-27T16:00:00",
    formaPagamento: "Crédito",
    produtos: [{ id: "4", nome: "Refrigerante lata", valorUnitario: 6.99, quantidade: 1 }],
    status: "finalizado",
  },
  {
    numero: "6748",
    nomeCliente: "Luisa Mendes",
    cpfCliente: "363.738.391-20",
    data: "2025-10-27T16:30:00",
    formaPagamento: "Pix",
    produtos: [{ id: "5", nome: "Pastel carne", valorUnitario: 6.99, quantidade: 1 }],
    status: "cancelado",
  },
];

export default function GerenciamentoPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_EXEMPLO);
  const [filtro, setFiltro] = useState({
    campo: "",
    dataInicial: "",
    dataFinal: "",
    status: "",
  });
  const [menuAtivo, setMenuAtivo] = useState<string | null>(null);
  const [detalhePedido, setDetalhePedido] = useState<Pedido | null>(null);
  const [pedidoCancelamento, setPedidoCancelamento] = useState<Pedido | null>(null);
  const [motivo, setMotivo] = useState("");
  const [pedidoPix, setPedidoPix] = useState<Pedido | null>(null); // usado para exibir o modal do comprovante
  const [confirmar, setConfirmar] = useState<"confirmar" | "recusar" | null>(null);

  // === Fecha o menu ao clicar fora ===
  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(`.${styles.infoButton}`) &&
        !target.closest(`.${styles.menu}`)
      ) {
        setMenuAtivo(null);
      }
    };

    document.addEventListener("click", handleClickFora);
    return () => document.removeEventListener("click", handleClickFora);
  }, []);

  // === Fecha modais ao clicar fora ===
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

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const matchCampo =
        !filtro.campo ||
        p.nomeCliente.toLowerCase().includes(filtro.campo.toLowerCase()) ||
        p.cpfCliente.includes(filtro.campo);
      const matchStatus = !filtro.status || p.status === filtro.status;
      const matchData =
        (!filtro.dataInicial || new Date(p.data) >= new Date(filtro.dataInicial)) &&
        (!filtro.dataFinal || new Date(p.data) <= new Date(filtro.dataFinal));
      return matchCampo && matchStatus && matchData;
    });
  }, [filtro, pedidos]);

  const atualizarStatus = (numero: string, novo: Status) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.numero === numero ? { ...p, status: novo, motivoCancelamento: motivo } : p
      )
    );
    setPedidoCancelamento(null);
    setMotivo("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gerenciamento de Pedidos</h1>

      {/* FILTROS */}
      <div className={styles.filters}>
        <input
          placeholder="Nome ou CPF"
          value={filtro.campo}
          onChange={(e) => setFiltro({ ...filtro, campo: e.target.value })}
        />
        <input
          type="date"
          value={filtro.dataInicial}
          onChange={(e) => setFiltro({ ...filtro, dataInicial: e.target.value })}
        />
        <input
          type="date"
          value={filtro.dataFinal}
          onChange={(e) => setFiltro({ ...filtro, dataFinal: e.target.value })}
        />
        <select
          value={filtro.status}
          onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="andamento">Andamento</option>
          <option value="pronto">Pronto</option>
          <option value="finalizado">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button className={styles.buscar}>Buscar</button>
      </div>

      {/* TABELA */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>N°</th>
            <th>Cliente</th>
            <th>CPF</th>
            <th>Data do pedido</th>
            <th>Forma de pagamento</th>
            <th>Qtd</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((p) => (
            <tr key={p.numero}>
              <td>{p.numero}</td>
              <td>{p.nomeCliente}</td>
              <td>{p.cpfCliente}</td>
              <td>
                {new Date(p.data).toLocaleDateString()}{" "}
                {new Date(p.data).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </td>
              <td>{p.formaPagamento}</td>
              <td>{p.produtos.length}</td>
              <td>R$ {calcularTotal(p.produtos).toFixed(2)}</td>
              <td>
                <span className={`${styles.status} ${styles[p.status]}`}>
                  {p.status === "andamento"
                    ? "Andamento"
                    : p.status === "pronto"
                    ? "Pronto"
                    : p.status === "finalizado"
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
                    setMenuAtivo(menuAtivo === p.numero ? null : p.numero);
                  }}
                >
                  i
                </button>

                {menuAtivo === p.numero && (
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
      </table>

      {/* MODAL DETALHES */}
      {detalhePedido && (
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
      )}

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
                onClick={() => atualizarStatus(pedidoCancelamento.numero, "cancelado")}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL PIX ===
          Exibido quando o estado `pedidoPix` está definido.
          Mostra o número do pedido e os botões de confirmar/recusar o pagamento. */}
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
  );
}
