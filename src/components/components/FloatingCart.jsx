import SingleCartItem from "./SingleCartItem.jsx";
import Button from "./Button.jsx";
import { useState, useEffect } from 'react';
import '../styles/floatingcart.css';

const FloatingCart = ({ className, showingCart, setShowingCart }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const updateCartFromLocalStorage = () => {
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(storedCart);
        };
        updateCartFromLocalStorage();
        window.addEventListener('storage', updateCartFromLocalStorage);
        return () => {
            window.removeEventListener('storage', updateCartFromLocalStorage);
        };
    }, []);

    const handleClose = () => {
        setShowingCart(!showingCart);
    };

    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event('storage'));
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        const updatedCart = cart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };



    return (
        <div className={`floating-cart-wrapper ${className}`}>
            <div className="overlay" onClick={handleClose}></div>
            <div className={`cart-content`}>
                <header>
                    <p>Кошик</p>
                    <button className="close-button" onClick={() => setShowingCart(!showingCart)}>&times;</button>
                </header>
                <div className="divider"></div>
                <ul className="cart-items">
                    {cart.length > 0 ? (
                        cart.map((cartItem) => (
                            <SingleCartItem
                                key={cartItem.id}
                                productId={cartItem.id}
                                quantity={cartItem.quantity}
                                onRemoveItem={handleRemoveItem}
                                onUpdateQuantity={handleUpdateQuantity}
                                handleClose={handleClose}
                            />
                        ))
                    ) : (
                        <p className="empty">Ваш кошик порожній.</p>
                    )}
                </ul>
                <Button>Оплата</Button>
            </div>
        </div>
    );
};

export default FloatingCart;
