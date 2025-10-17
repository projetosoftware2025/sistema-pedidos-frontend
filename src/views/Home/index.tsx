import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { HeaderComponent } from "../../components/Header";
import { Users, Fish, Search } from "lucide-react";
import { SidebarComponent } from "../../components/SidebarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import cafeManha from "../../assets/cafe-manha.png";
import almoco from "../../assets/almoco.png";

interface ItemImage {
  id: number;
  imagem: string;
  nome: string;
}

const itens: ItemImage[] = [
  {
    id: 1,
    imagem: cafeManha,
    nome: "Café da Manhã"
  },
  {
    id: 2,
    imagem: almoco,
    nome: "Almoço"
  },
  {
    id: 3,
    imagem: cafeManha,
    nome: "Café da Manhã"
  },
  {
    id: 4,
    imagem: cafeManha,
    nome: "Café da Manhã"
  },
  {
    id: 5,
    imagem: cafeManha,
    nome: "Café da Manhã"
  },
  {
    id: 6,
    imagem: cafeManha,
    nome: "Café da Manhã"
  }
]

export const HomeView = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.app.isSidebarOpen);

  return (
    <div className={styles.container}>
      <HeaderComponent />
      <div className={styles.containerBox}>
        <SidebarComponent
          isOpen={isSidebarOpen}
        />
        <div className={styles.inputGroup}>
          <input
            type="text"
            onFocus={() => { }}
            onChange={(e) => { }}
            placeholder="Buscar produto"
            className={styles.input}
          />
          <button  className={styles.button}>
            <Search size={24} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.containerItens}>
          {
            itens.map((item) => (
              <div key={item.id} className={styles.containerItem} style={{ backgroundImage: `url(${item.imagem})` }}>
                <span className={styles.itemText}>{item.nome}</span>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  );
};
