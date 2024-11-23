import SingleCartItem from "./SingleCartItem.jsx";
import Button from "./Button.jsx";
import { useState, useEffect } from 'react';
import '../styles/floatingcart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const updateCartFromLocalStorage = () => {
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(storedCart);
        };
        updateCartFromLocalStorage();
        window.addEventListener('storage', updateCartFromLocalStorage);
        setIsLoading(false)
        return () => {
            window.removeEventListener('storage', updateCartFromLocalStorage);
        };

    }, []);

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

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Завантаження...</p>
            </div>
        );
    }

    return (
        <div className="cart-wrapper">
            <header>
                <p style={{fontSize:"30px"}}>Кошик</p>
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
                        />
                    ))
                ) : (
                    <p className="empty" style={{fontSize:"20px"}}>Ваш кошик порожній.</p>
                )}
            </ul>
            <Button>Оплата</Button>
        </div>
    );
};

export default Cart;
