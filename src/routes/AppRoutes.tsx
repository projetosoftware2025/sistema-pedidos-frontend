import { createBrowserRouter } from "react-router-dom";
import { LoginView } from "../views/Login";
import { HomeView } from "../views/Home";
import CadastroView from "../views/Cadastro";
import { MeusPedidos } from "../views/MeusPedidos";
import { Carrinho } from "../views/Carrinho";

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
    path: "*",
    element: <h1>Página não encontrada</h1>,
  },
]);

  
