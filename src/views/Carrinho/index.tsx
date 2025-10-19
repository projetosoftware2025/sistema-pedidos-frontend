import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { ChevronLeft, CircleChevronLeft, Trash } from "lucide-react";
import { HeaderComponent } from "../../components/Header";
import { useState } from "react";
import { addToCart, CartItemInterface, removeFromCart, removeOneFromCart } from "../../redux/reducers/cartReducer";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const Carrinho = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItens: CartItemInterface[] = useSelector(
        (state: RootState) => state.cart.cartProdutos
    );


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.toBack} onClick={() => {
                    navigate("/")
                }}>
                    <ChevronLeft size={32} strokeWidth={2} />
                </div>
                <span>Carrinho</span>
            </div>
            <div className={styles.listaProdutos}>
                {cartItens.map((produto) => (
                    <div key={produto.id} className={styles.produto}>
                        <div
                            className={styles.produtoImage}
                            style={{ backgroundImage: `url(${produto.url})` }}
                        ></div>
                        <div className={styles.produtoInfo}>
                            <div>{produto.titulo}</div>
                            <div>{produto.descricao}</div>
                            <div>R$ {produto.preco.toFixed(2)}</div>
                        </div>
                        <div className={styles.controles}>
                            <button onClick={() => dispatch(removeOneFromCart(produto.id))}>-</button>
                            <span>{produto.quantidade}</span>
                            <button onClick={() => dispatch(addToCart({ ...produto, quantidade: 1 }))}>+</button>
                            <span
                                className={styles.remover}
                                onClick={() => {
                                    dispatch(removeFromCart(produto.id))
                                    toast.info("Produto removido do carrinho!");
                                }}

                            >
                                <Trash size={22} strokeWidth={2} />
                            </span>
                        </div>
                    </div>
                ))}



            </div>
        </div>
    );
};
