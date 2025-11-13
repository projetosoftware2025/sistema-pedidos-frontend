import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { UserInterface } from "../../app/models/interfaces/UserInterface";
import { RootState } from "../../redux/store";
import { ShoppingBag, Menu, MarsStroke, X, DoorClosed, DoorOpen, Outdent, LogOut, LogOutIcon, BotOff, PowerOff, PowerOffIcon } from "lucide-react";
import logo from "../../assets/logo.png";
import { setSideBar } from "../../redux/reducers/appReducer";
import { DeviceType } from "../../app/models/types/DeviceType";
import { toast } from "react-toastify";
import { resetAuth } from "../../redux/reducers/authReducer";

interface HeaderProps {
  device: DeviceType
}

export const HeaderComponent: React.FC<HeaderProps> = ({ device }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);

  const user: UserInterface = useSelector(
    (state: RootState) => state.auth.user
  );

  useEffect(() => {

    const checkUser = () => {
      if (!user.logado) {
        toast.error("Sessão encerrada! Faça login para prosseguir.")
        navigate("/login")
      }
    }
    checkUser()
    dispatch(setSideBar(false))
  }, [navigate, dispatch, user]);

  return (
    <>
      <div className={styles.header}>
        <div
          className={styles.menuIcon}
          onClick={() => {
            dispatch(setSideBar(true));
          }}
        >
          {isSidebarOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </div>

        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo SuculentuS" className={styles.logo} />
        </div>

        <div className={styles.cartContainer}>
          <div className={styles.nameUser}>Olá, {user.usuario} </div>  {" "} 
          |

          <div
            className={styles.menuIcon}
            title="Sair"
            onClick={() => {
              navigate("/login")
              dispatch(resetAuth());
              toast.info("Sessão encerrada.")
            }}
          >
            <PowerOffIcon size={22} color="white" />
          </div>
        </div>
      </div>

    </>
  );
};
