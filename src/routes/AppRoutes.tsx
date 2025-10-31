import { createBrowserRouter } from "react-router-dom";
import { LoginView } from "../views/Login";
import { HomeView } from "../views/Home";
import CadastroView from "../views/Cadastro";
import { MeusPedidos } from "../views/MeusPedidos";
import { Carrinho } from "../views/Carrinho";
import RecuperarAcesso from "../views/RecuperarAcesso";
import { CodigoRecuperar } from "../views/CodigoRecuperar";
import { RedefinirSenha } from "../views/RedefinirSenha";
import { TeladeFinalizacao } from "../views/TeladeFinalizacao";
import { DadosPessoais } from "../views/DadosPessoais";
import { RedirectPage } from "../views/RedirectPage";
import { GestaoCadastros } from "../views/GestaoCadastros";
import { GestaoProdutos } from "../views/GestaoProdutos";


export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/cadastro",
    element: <CadastroView />,
  },
  {
    path: "/meus-pedidos",
    element: <MeusPedidos />,
  },
  {
    path: "/carrinho",
    element: <Carrinho />,
  },
  {
    path: "/recuperar-acesso",
    element: <RecuperarAcesso />,
  },
  {
    path: "/recuperar-codigo",
    element: <CodigoRecuperar />,
  },
  {
    path: "/nova-senha",
    element: <RedefinirSenha />,
  },
  {
    path: "/tela-finalizado",
    element: <TeladeFinalizacao />,
  },
  {
    path: "/dados-pessoais",
    element: <DadosPessoais />,
  },
  {
    path: "*",
    element: <RedirectPage />,
  },
  {
    path: "gestao-cadastros",
    element: <GestaoCadastros/>
  },
  {
    path: "gestao-produtos",
    element: <GestaoProdutos/>
  }
]);
