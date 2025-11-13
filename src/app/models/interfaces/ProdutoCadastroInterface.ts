export interface ProdutoCadastroInterface {
    id?: number;
    titulo: string;
    descricao: string;
    preco: string;
    categoria: string;
    imagem: File | null;
}