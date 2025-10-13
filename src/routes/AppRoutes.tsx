import { createBrowserRouter } from "react-router-dom";
import { LoginView } from "../views/Login";
import { HomeView } from "../views/Home";
import CadastroView from "../views/Cadastro";

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <LoginView />, 
  },
  {
    path: "/home",
    element: <HomeView />,
  },
  {
    path: "/cadastro", // ✅ Corrigido aqui
    element: <CadastroView />, 
  },
  {
    path: "*", // ✅ Rota de erro personalizada (opcional)
    element: <h1>Página não encontrada</h1>,
  },
]);

  
