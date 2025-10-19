import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
// Importamos a store e o persistor (que precisa ser exportado do store.ts)
import store, { persistor } from "./redux/store"; 
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
// Importamos o PersistGate para segurar a renderização até o estado ser carregado
import { PersistGate } from 'redux-persist/integration/react'; 

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    {/* 1. Usamos o PersistGate aqui */}
    <PersistGate loading={null} persistor={persistor}>
      
      {/* 2. O conteúdo que depende do estado (rotas, toasts) fica dentro dele */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <RouterProvider router={AppRoutes} />
      
    </PersistGate>
  </Provider>
);
