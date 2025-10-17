import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth, setUser } from "../../redux/reducers/authReducer";
import { UserInterface } from "../../app/models/interfaces/UserInterface";
import { RootState } from "../../redux/store";
import { tokenService } from "../../app/services/user/loginByTokenUser";
import { ShoppingBag, Menu, MarsStroke, X } from "lucide-react";
import logo from "../../assets/logo.png";
import { setSideBar } from "../../redux/reducers/appReducer";

export const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSideBar, setShowSideBar] = useState(false);

  const user: UserInterface = useSelector(
    (state: RootState) => state.auth.user
  );

  useEffect(() => {
    // const handleStorageChange = () => {
    //   const token = localStorage.getItem("token");
    //   if (token) {
    //     validateToken(token);
    //   }
    // };

    // const validateToken = async (token: string) => {
    //   try {
    //     const response = await tokenService(token);
    //     if (response.status === "error") {
    //       navigate("/login");
    //       return;
    //     }
    //     dispatch(setUser(response.data));
    //   } catch (error) {
    //     console.error("Erro ao validar token:", error);
    //     navigate("/login");
    //   }
    // };

    // window.addEventListener("storage", handleStorageChange);
    // handleStorageChange();

    // return () => {
    //   window.removeEventListener("storage", handleStorageChange);
    // };

    dispatch(setSideBar(false))
  }, [navigate, dispatch]);

  const handleUserOut = () => {
    dispatch(resetAuth());
    localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <>
      <div className={styles.header}>
        <div
          className={styles.menuIcon}
          onClick={() => {
            setShowSideBar(!showSideBar);
            dispatch(setSideBar(!showSideBar));
          }}
        >
          {showSideBar ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </div>

        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo SuculentuS" className={styles.logo} />
        </div>

        <div className={styles.cartContainer}>
          <ShoppingBag size={28} color="white" />
          <div className={styles.cartNumber}>2</div>
        </div>
      </div>

    </>
  );
};
