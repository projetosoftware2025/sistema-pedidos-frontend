import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "./index.module.css";
import { Plus, Edit2, X, Trash } from "lucide-react";
import { URL_API_GESTAO } from "../../utils/constants";
import { ProdutoCadastroInterface } from "../../app/models/interfaces/ProdutoCadastroInterface";
import { ItemImageInterface } from "../../app/models/interfaces/ItemImageInterface";
import { SidebarComponent } from "../../components/SidebarComponent";
import { HeaderComponent } from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setSideBar } from "../../redux/reducers/appReducer";

interface ProdutoLocal {
  id: number;
  titulo: string;
  descricao: string;
  preco: string;
  ativo?: boolean;
  categoriaId: string;
  imagem: File | null;
}

export const GestaoCadastros: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<"produtos" | "categorias">("produtos");
  const [produtos, setProdutos] = useState<ProdutoLocal[]>([]);
  const [categorias, setCategorias] = useState<ItemImageInterface[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<ProdutoLocal | null>(null);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [imagemCategoria, setImagemCategoria] = useState<File | null>(null);
  const [loadingCategoria, setLoadingCategoria] = useState(false);

  const [produto, setProduto] = useState<ProdutoCadastroInterface>({
    id: 0,
    titulo: "",
    descricao: "",
    preco: "",
    categoria: "",
    imagem: null,
  });
  const [categoriaDescricao, setCategoriaDescricao] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);

  // 🔄 Buscar produtos
  const buscarProdutos = async () => {
    try {
      const response = await axios.get(`${URL_API_GESTAO}/produto/buscar-produtos`);
      if (response.status === 200) setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // 🔄 Buscar categorias
  const buscarCategorias = async () => {
    try {
      const response = await axios.get(`${URL_API_GESTAO}/categoria/buscar-categorias`);
      if (response.status === 200) {
        const data = Array.isArray(response.data) ? response.data : [];
        setCategorias(data);
        if (data.length > 0) {
          setProduto((prev) => ({ ...prev, categoria: String(data[0].id) }));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    buscarCategorias();
    buscarProdutos();
  }, []);

  const filtraCategoria = (id: string) => {
    const categoria = categorias.find((c) => c.id.toString() === id.toString());
    return categoria ? categoria.descricao : "—";
  };

  // 🟢 Abrir modal de produto
  const abrirModal = (p?: ProdutoLocal) => {
    if (p) {
      setEditando(p);
      setProduto({
        id: p.id,
        titulo: p.titulo,
        descricao: p.descricao,
        preco: p.preco,
        categoria: p.categoriaId,
        imagem: p.imagem,
      });
      if (p.imagem) setPreview(URL.createObjectURL(p.imagem));
      else setPreview(null);
    } else {
      setEditando(null);
      setProduto({
        titulo: "",
        descricao: "",
        preco: "",
        categoria: categorias[0]?.id ? String(categorias[0].id) : "",
        imagem: null,
      });
      setPreview(null);
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduto((prev) => ({ ...prev, imagem: file }));
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  // 💾 Salvar produto (novo ou editar)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { titulo, descricao, preco, categoria, imagem } = produto;

    if (!titulo || !descricao || !preco || !categoria) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      let response;

      // SE FOR EDIÇÃO
      if (editando) {
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("preco", preco.toString());
        formData.append("categoria", categoria);
        formData.append("ativo", editando.ativo ? "true" : "false");

        if (imagem) formData.append("imagem", imagem);

        response = await axios.put(
          `${URL_API_GESTAO}/produto/atualizar?id=${editando.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }


      // SE FOR CRIAÇÃO
      else {
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("preco", preco);
        formData.append("categoria", categoria);
        formData.append("ativo", "true");

        if (imagem) formData.append("imagem", imagem);

        response = await axios.post(
          `${URL_API_GESTAO}/produto/cadastrar`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // Atualiza lista local
      const novoProduto: ProdutoLocal = {
        id: editando ? editando.id : produtos.length + 1,
        titulo,
        descricao,
        preco,
        imagem: imagem || null,
        categoriaId: categoria,
        ativo: editando ? editando.ativo : true,
      };

      setProdutos((prev) =>
        editando
          ? prev.map((p) => (p.id === editando.id ? novoProduto : p))
          : [...prev, novoProduto]
      );

      fecharModal();
      alert(response.data?.mensagem || "Produto salvo com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  // 🗑️ Desativar (lixeira)
  const desativarProduto = async (p: ProdutoLocal) => {
    if (!window.confirm(`Deseja desativar o produto "${p.titulo}"?`)) return;
    try {
      const payload = {
        titulo: p.titulo,
        descricao: p.descricao,
        preco: parseFloat(p.preco.toString()),
        categoria: p.categoriaId,
        ativo: false,
      };

      await axios.put(`${URL_API_GESTAO}/produto/atualizar?id=${p.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Produto desativado com sucesso!");
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao desativar produto:", error);
      alert("Erro ao desativar produto!");
    }
  };

  // ➕ Cadastrar categoria
  const cadastrarCategoria = async () => {
    if (!categoriaDescricao.trim()) {
      alert("Digite uma descrição para a categoria!");
      return;
    }
    try {
      await axios.post(`${URL_API_GESTAO}/categoria/cadastrar`, {
        descricao: categoriaDescricao,
      });
      alert("Categoria cadastrada com sucesso!");
      setCategoriaDescricao("");
      buscarCategorias();
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      alert("Erro ao cadastrar categoria.");
    }
  };

  const salvarCategoria = async () => {
    if (!categoriaDescricao.trim()) {
      alert("Descrição obrigatória!");
      return;
    }

    setLoadingCategoria(true);

    try {
      const form = new FormData();
      form.append("descricao", categoriaDescricao);
      if (imagemCategoria) form.append("imagem", imagemCategoria);

      let response;

      if (!editando) {
        response = await axios.post(`${URL_API_GESTAO}/categoria/cadastrar`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.put(
          `${URL_API_GESTAO}/categoria/${editando.id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      alert(response.data?.mensagem || "Categoria salva!");
      setModalCategoria(false);
      buscarCategorias();

    } catch (e) {
      console.error(e);
      alert("Erro ao salvar categoria.");
    } finally {
      setLoadingCategoria(false);
    }
  };

  const desativarCategoria = async (categoria: any) => {
    if (!window.confirm(`Desativar categoria "${categoria.descricao}"?`)) return;

    try {
      await axios.delete(`${URL_API_GESTAO}/categoria/deletar/${categoria.id}`);
      alert("Categoria desativada!");
      buscarCategorias();
    } catch {
      alert("Erro ao desativar categoria!");
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
          <h1 className={styles.title}>Produtos & Categorias</h1>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${abaAtiva === "produtos" ? styles.active : ""}`}
              onClick={() => {
                setAbaAtiva("produtos");
                buscarProdutos();
              }}
            >
              Produtos
            </button>
            <button
              className={`${styles.tabButton} ${abaAtiva === "categorias" ? styles.active : ""}`}
              onClick={() => setAbaAtiva("categorias")}
            >
              Categorias
            </button>
          </div>
        </div>

        {/* 🧱 PRODUTOS */}
        {abaAtiva === "produtos" && (
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <button className={styles.addBtn} onClick={() => abrirModal()}>
                <Plus size={18} /> Novo Produto
              </button>
            </div>

            {produtos.length ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Descrição</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th>Categoria</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.titulo}</td>
                        <td>{p.descricao}</td>
                        <td>R$ {Number(p.preco).toFixed(2).replace(".", ",")}</td>
                        <td>{p.ativo ? "Ativo" : "Inativo"}</td>
                        <td>{filtraCategoria(p.categoriaId)}</td>
                        <td>
                          <div className={styles.btnsAcao}>
                            <button className={styles.editBtn} onClick={() => abrirModal(p)}>
                              <Edit2 size={16} />
                            </button>
                            <button
                              className={styles.trashBtn}
                              onClick={() => desativarProduto(p)}
                              title="Desativar produto"
                            >
                              <Trash size={16} />
                            </button>
                          </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              "Sem produtos"
            )}
          </div>
        )}

        {abaAtiva === "categorias" && (
          <div className={styles.content}>

            <div className={styles.toolbar}>
              <button className={styles.addBtn} onClick={() => {
                setEditando(null);
                setCategoriaDescricao("");
                setPreview(null);
                setImagemCategoria(null);
                setModalCategoria(true);
              }}>
                <Plus size={18} /> Nova Categoria
              </button>
            </div>

            {categorias.length ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th>Imagem</th>
                      <th>Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categorias.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.descricao}</td>
                        <td>
                          {c.id && (
                            <img
                              src={`${URL_API_GESTAO}/categoria/imagem/${c.id}`}
                              width={40}
                              style={{ borderRadius: "6px" }}
                            />
                          )}
                        </td>
                        {/* <td>{c.ativo ? "Ativo" : "Inativo"}</td> */}
                        <td>
                          <div className={styles.btnsAcao}>
                            {/* <button
                              className={styles.editBtn}
                              onClick={() => {
                                // setEditando();
                                setCategoriaDescricao(c.descricao);
                                setPreview(`${URL_API_GESTAO}/categoria/${c.id}/imagem`);
                                setImagemCategoria(null);
                                setModalCategoria(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </button> */}

                            <button
                              className={styles.trashBtn}
                              onClick={() => desativarCategoria(c)}
                              title="Desativar categoria"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            ) : (
              "Sem categorias"
            )}

            {/* ================== MODAL CATEGORIA ================== */}
            {modalCategoria && (
              <div className={styles.modalOverlay} onClick={() => setModalCategoria(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h2>{editando ? "Editar Categoria" : "Nova Categoria"}</h2>
                    <button className={styles.closeBtn} onClick={() => setModalCategoria(false)}>
                      <X size={22} />
                    </button>
                  </div>

                  <div className={styles.modalBody}>
                    <label>Descrição:</label>
                    <input
                      type="text"
                      value={categoriaDescricao}
                      onChange={(e) => setCategoriaDescricao(e.target.value)}
                      placeholder="Descrição da categoria"
                    />

                    <label>Imagem:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImagemCategoria(file);
                        if (file) setPreview(URL.createObjectURL(file));
                      }}
                    />

                    {preview && (
                      <img src={preview} className={styles.previewImg} />
                    )}
                  </div>

                  <div className={styles.modalFooter}>
                    <button
                      className={styles.saveBtn}
                      disabled={loading}
                      onClick={salvarCategoria}
                    >
                      {loading
                        ? "Salvando..."
                        : editando
                          ? "Salvar Alterações"
                          : "Cadastrar Categoria"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}


        {/* 🧩 MODAL DE PRODUTO */}
        {modalAberto && (
          <div className={styles.modalOverlay} onClick={fecharModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editando ? "Editar Produto" : "Novo Produto"}</h2>
                <button className={styles.closeBtn} onClick={fecharModal}>
                  <X size={22} />
                </button>
              </div>

              <form className={styles.modalBody} onSubmit={handleSubmit}>
                <label>Título:</label>
                <input
                  type="text"
                  name="titulo"
                  value={produto.titulo}
                  onChange={handleChange}
                  placeholder="Nome do produto"
                  required
                />

                <label>Descrição:</label>
                <textarea
                  name="descricao"
                  value={produto.descricao}
                  onChange={handleChange}
                  placeholder="Descrição do produto"
                  rows={3}
                  required
                />

                <label>Preço:</label>
                <input
                  type="number"
                  name="preco"
                  value={produto.preco}
                  placeholder="Ex: 2.0"
                  onChange={handleChange}
                  step="0.01"
                  required
                />

                <label>Categoria:</label>
                <select name="categoria" value={produto.categoria} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecione uma Categoria
                  </option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.descricao}
                    </option>
                  ))}
                </select>

                <label>Imagem:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />

                {preview && <img src={preview} alt="Pré-visualização" className={styles.previewImg} />}

                <div className={styles.modalFooter}>
                  <button type="submit" className={styles.saveBtn} disabled={loading}>
                    {loading
                      ? "Salvando..."
                      : editando
                        ? "Salvar Alterações"
                        : "Cadastrar Produto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
