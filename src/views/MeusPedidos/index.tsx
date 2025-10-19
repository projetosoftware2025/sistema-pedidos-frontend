import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { ChevronLeft, CircleChevronLeft } from "lucide-react";
import { HeaderComponent } from "../../components/Header";

export const MeusPedidos = () => {
	const navigate = useNavigate();

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.toBack} onClick={() => {
					navigate("/")
				}}>
					<ChevronLeft size={32} strokeWidth={2} />
				</div>
				<span>Meus Pedidos</span>
			</div>
		</div>
	);
};
