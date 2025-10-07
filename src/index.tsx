import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <RouterProvider router={AppRoutes} />
  </Provider>
);
