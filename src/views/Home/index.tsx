import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { HeaderComponent } from "../../components/Header";
import { SidebarComponent } from "../../components/SidebarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { UserInterface } from "../../app/models/interfaces/UserInterface";
import { DeviceType } from "../../app/models/types/DeviceType";
import { setSideBar } from "../../redux/reducers/appReducer";

import { ClipboardList, Package } from "lucide-react";
import { toast } from "react-toastify";

export const HomeView = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);
  const user: UserInterface = useSelector(
    (state: RootState) => state.auth.user
  );
  const [device, setDevice] = useState<DeviceType>(undefined)

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setDevice("desktop")

    } else {
      setDevice("mobile")
    }

  }, [user]);

  return (
    <div className={styles.container}>

      <HeaderComponent device={device} />
      <div className={styles.containerBox}>
        <SidebarComponent
          isOpen={isSidebarOpen}
          onClose={() => dispatch(setSideBar(false))}
          device={device}
        />


        <main className={styles.container}>
          <div className={styles.modulesGrid}>
            <div
              className={styles.moduleCard}
              onClick={() => navigate("/gestao-pedidos")}
            >
              <ClipboardList className={styles.icon} />
              <span>Gestão de Pedidos</span>
            </div>

            <div
              className={styles.moduleCard}
              onClick={() => navigate("/gestao-cadastros")}
            >
              <Package className={styles.icon} />
              <span>Produtos & Categorias</span>
            </div>

            {/* <div
                className={styles.moduleCard}
                onClick={() => navigate("/relatorios")}
              >
                <BarChart3 className={styles.icon} />
                <span>Relatórios</span>
              </div> */}
          </div>
        </main>

      </div>


    </div>
  );
};
