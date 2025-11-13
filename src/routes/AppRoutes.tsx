import { createBrowserRouter } from "react-router-dom";
import { LoginView } from "../views/Login";
import { HomeView } from "../views/Home";
import CadastroView from "../views/Cadastro";
import RecuperarAcesso from "../views/RecuperarAcesso";
import { CodigoRecuperar } from "../views/CodigoRecuperar";
import { TeladeFinalizacao } from "../views/TeladeFinalizacao";
import GerenciamentoPedidos from "../views/GerenciamentoPedidos";
import { RedirectPage } from "../views/RedirectPage";
import { GestaoCadastros } from "../views/GestaoCadastros";
import RedefinirSenha from "../views/RedefinirSenha";

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
    path: "/gestao-cadastros",
    element: <GestaoCadastros />,
  },
  {
    path: "/gestao-pedidos",
    element: <GerenciamentoPedidos />,
  },
  {
    path: "*",
    element: <RedirectPage />,
  },
]);
