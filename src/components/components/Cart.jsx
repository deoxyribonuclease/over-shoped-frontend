import SingleCartItem from "./SingleCartItem.jsx";
import Button from "./Button.jsx";
import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import '../styles/floatingcart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    const handlePaymentClick = () => {
        if (cart.length > 0) {
            navigate("/checkout");
        }
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
        <div className="cart-wrapper" style={{backgroundColor:"#f4f4f5", padding:"20px"}}>
            <header>
                <p style={{fontSize:"30px",color:"#737373FF", fontWeight:"700"}}>Кошик</p>
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
                    <p className="empty" style={{marginTop:"60px"}}>Ваш кошик порожній.</p>
                )}
            </ul>
            <Button func={handlePaymentClick}>Оплата</Button>
        </div>
    );
};

export default Cart;
