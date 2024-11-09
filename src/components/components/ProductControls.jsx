import PropTypes from "prop-types";
import { Plus, Minus, Cart } from "../../icons/index";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import '../styles/productcontrols.css';

const ProductControls = ({ productId, productName, productPrice }) => {
    const [amount, setAmount] = useState(1);
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            setIsInCart(true);
            setAmount(existingProduct.quantity);
        }
    }, [productId]);

    const increaseAmount = () => {
        setAmount(prevAmount => prevAmount + 1);
    };

    const decreaseAmount = () => {
        if (amount > 1) {
            setAmount(prevAmount => prevAmount - 1);
        }
    };

    const addToCart = () => {
        const product = { id: productId, name: productName, price: productPrice, quantity: amount };
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += amount;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(true);
        window.dispatchEvent(new Event('storage'));
    };

    const removeFromCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setIsInCart(false);
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="controls-wrapper">
            <div className="inner-controls">
                <button onClick={decreaseAmount}>
                    <Minus />
                </button>
                <span className="amount">{amount}</span>
                <button onClick={increaseAmount}>
                    <Plus />
                </button>
            </div>
            <Button
                className={`cart ${isInCart ? 'in-cart' : 'add-to-cart'}`}
                func={isInCart ? removeFromCart : addToCart}
            >
                <Cart />
                {isInCart ? "У кошику" : "Додати у кошик"}
            </Button>

        </div>
    );
};

ProductControls.propTypes = {
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
};

export default ProductControls;
