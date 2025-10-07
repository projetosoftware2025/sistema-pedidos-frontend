import {createBrowserRouter} from "react-router-dom";
import { LoginView } from "../views/Login";
import { HomeView } from "../views/Home";

export const AppRoutes = createBrowserRouter([
    {
      path: "/",
      element: <LoginView />, 
    },
    {
      path: "/home",
      element: <HomeView />,
    }
  ]);
