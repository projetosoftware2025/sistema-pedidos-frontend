import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { HeaderComponent } from "../../components/Header";
import { Users, Fish } from "lucide-react";

export const HomeView = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <HeaderComponent />
      <div className={styles.containerBox}>
        <div className={styles.containerItens}>
          <div className={styles.containerItem} onClick={() => alert("")}>
            <Users size={26} color="white" /> Item 1
          </div>
          <div className={styles.containerItem}>
            <Fish size={26} color="white" /> Item 22
          </div>
        </div>
      </div>
    </div>
  );
};
