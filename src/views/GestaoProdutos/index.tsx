import axios from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface ProdutoCadastro {
    titulo: string;
    descricao: string;
    preco: string;
    categoria: string;
    imagem: File | null;
}

export const GestaoProdutos: React.FC = () => {
    const [produto, setProduto] = useState<ProdutoCadastro>({
        titulo: "",
        descricao: "",
        preco: "",
        categoria: "",
        imagem: null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProduto((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProduto((prev) => ({ ...prev, imagem: file }));
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { titulo, descricao, preco, categoria, imagem } = produto;

        if (!titulo || !descricao || !preco || !categoria) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("preco", preco);
        formData.append("categoria", categoria);
        if (imagem) formData.append("imagem", imagem);

        setLoading(true);

        // ... dentro do handleSubmit
        try {
            const response = await axios.post(
                "http://localhost:8080/produto/cadastrar",
                formData
                // sem o headers Content-Type
            );

            alert(response.data);
            // reset...
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            alert("Erro ao cadastrar produto. Tente novamente.");
        }

    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "500px",
                margin: "40px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                background: "#f9f9f9",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                Cadastro de Produto
            </h2>

            <label>
                Título:
                <input
                    type="text"
                    name="titulo"
                    value={produto.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Tinta Coral 18L"
                    required
                />
            </label>

            <label>
                Descrição:
                <textarea
                    name="descricao"
                    value={produto.descricao}
                    onChange={handleChange}
                    placeholder="Informe os detalhes do produto..."
                    rows={3}
                    required
                />
            </label>

            <label>
                Preço:
                <input
                    type="number"
                    name="preco"
                    step="0.01"
                    value={produto.preco}
                    onChange={handleChange}
                    placeholder="Ex: 199.90"
                    required
                />
            </label>

            <label>
                Categoria:
                <input
                    type="text"
                    name="categoria"
                    value={produto.categoria}
                    onChange={handleChange}
                    placeholder="Ex: Tintas"
                    required
                />
            </label>

            <label>
                Imagem:
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>

            {preview && (
                <img
                    src={preview}
                    alt="Pré-visualização"
                    style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        alignSelf: "center",
                        marginTop: "10px",
                    }}
                />
            )}

            <button
                type="submit"
                disabled={loading}
                style={{
                    backgroundColor: loading ? "#888" : "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Cadastrando..." : "Cadastrar Produto"}
            </button>
        </form>
    );
};
