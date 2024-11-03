import SingleCartItem from "./SingleCartItem.jsx";
import Button from "./Button.jsx";
import { useGlobalContext } from '../../context/context';
import '../styles/floatingcart.css';
import { useState } from 'react';

const FloatingCart = ({ className }) => {
    const { state, hideCart } = useGlobalContext();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
            hideCart();
            setIsClosing(false);
    };

    return (
        <div className={`floating-cart-wrapper ${state.showingCart ? 'active' : ''}`}>
            <div className="overlay" onClick={handleClose}></div>
            <div className={`cart-content ${isClosing ? 'slide-out' : ''}`}>
                <header>
                    <p>Кошик</p>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </header>
                <div className="divider"></div>
                <ul className="cart-items">
                    {state.cart.length > 0 ? (
                        state.cart.map((cartItem) => (
                            <SingleCartItem key={cartItem.productId} {...cartItem} />
                        ))
                    ) : (
                        <p className="empty">Ваш кошик порожній.</p>
                    )}
                    {state.cart.length > 0}
                </ul>
                <Button>Оплата</Button>
            </div>
        </div>
    );
};

export default FloatingCart;
