import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { URL_API_GESTAO } from "../../utils/constants";

export const GestaoCadastros = () => {
  const [descricao, setDescricao] = useState<string>("");
  const [imagem, setImagem] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!descricao) {
      alert("Descrição é obrigatória");
      return;
    }

    const formData = new FormData();
    formData.append("descricao", descricao);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await axios.post(
        `${URL_API_GESTAO}/categoria/cadastrar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data);
      setDescricao("");
      setImagem(null);
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      alert("Erro ao cadastrar categoria. Tente novamente.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagem(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <label>
        Descrição:
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Tintas, Pisos..."
        />
      </label>

      <label>
        Imagem:
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <button type="submit">Cadastrar Categoria</button>
    </form>
  );
};
