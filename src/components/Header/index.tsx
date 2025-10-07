import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth, setUser } from "../../redux/reducers/authReducer";
import { UserInterface } from "../../app/models/interfaces/UserInterface";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { tokenService } from "../../app/services/user/loginByTokenUser";
import { LogOut } from "lucide-react";

export const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user: UserInterface = useSelector(
    (state: RootState) => state.auth.user
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        validateToken(token);
      }
    };

    const validateToken = async (token: string) => {
      try {
        const response = await tokenService(token);
        console.log("response token service", response);
        if (response.status === "error") {
          navigate("/");
          return;
        }
        dispatch(setUser(response.data));
      } catch (error) {
        console.error("Erro ao validar token:", error);
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    handleStorageChange(); // Chamada inicial

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, dispatch]);

  const handleUserOut = () => {
    dispatch(resetAuth());
    localStorage.setItem("token", "");
    navigate("/");
  };
  return (
    <div className={styles.header}>
      <div className={styles.menu}>
        logo 
      </div>
      <div className={styles.lista}>
        <div className={styles.userName}>Olá, {user.nome}</div> |
        <div
          className={styles.userExit}
          onClick={() => {
            handleUserOut();
          }}
        >
          <LogOut size={24} color="white" /> Sair
        </div>
      </div>
    </div>
  );
};
