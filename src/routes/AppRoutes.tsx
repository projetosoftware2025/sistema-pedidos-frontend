import { createBrowserRouter } from "react-router-dom";
import { LoginView } from "../views/Login";
import { HomeView } from "../views/Home";
import CadastroView from "../views/Cadastro";

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
    path: "*",
    element: <h1>Página não encontrada</h1>,
  },
]);

  
