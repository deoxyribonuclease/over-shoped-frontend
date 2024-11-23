import PropTypes from "prop-types";
import { Plus, Minus, Cart, Heart } from "../../icons/index";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import '../styles/productcontrols.css';
import { addToFavorites, removeFromFavorites, getUserFavorites } from "../../api/userApi.jsx";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const ProductControls = ({ productId, productName, productPrice, amount }) => {
    const [amounts, setAmounts] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = Cookies.get("authToken");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.user.id;
                setUserId(userId);

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProduct = cart.find(item => item.id === productId);
                if (existingProduct) {
                    setIsInCart(true);
                }
                console.log(amount)
                console.log(amounts)
                const initializeFavorites = async () => {
                    try {
                        const favorites = await getUserFavorites(userId);
                        const isFav = favorites.some(item => item.productId === productId);
                        setIsFavorite(isFav);
                    } catch (error) {
                        console.error("Error initializing favorites:", error);
                    }
                };

                initializeFavorites();
                setIsLoading(false);

            } catch (error) {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [productId]);

    const increaseAmount = () => {
        if (amounts < amount) {
            setAmounts(prevAmount => prevAmount + 1);
        }
    };

    const decreaseAmount = () => {
        if (amounts > 1) {
            setAmounts(prevAmount => prevAmount - 1);
        }
    };

    const addToCart = () => {
        const product = { id: productId, name: productName, price: productPrice, quantity: amounts };
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity = Math.min(cart[existingProductIndex].quantity + amounts, amount);
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

    const toggleFavorite = async () => {
        if (!userId) {
            return;
        }

        try {
            if (isFavorite) {
                await removeFromFavorites(userId, productId);
            } else {
                await addToFavorites(userId, productId);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite status:", error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="controls-wrapper">
            <div className="inner-controls">
                <button onClick={decreaseAmount}>
                    <Minus/>
                </button>
                <span className="amount">{amounts}</span>
                <button onClick={increaseAmount}>
                    <Plus/>
                </button>
            </div>
            <Button
                className={`cart ${isInCart ? 'in-cart' : 'add-to-cart'} ${amount <= 0 ? 'in-cart' : ''}`}
                func={amount > 0 ? (isInCart ? removeFromCart : addToCart) : null}
            >
                <Cart />
                {amount <= 0
                    ? "Товар недоступний"
                    : isInCart
                        ? "У кошику"
                        : "Додати у кошик"}
            </Button>


            {userId && (
                <button
                    className="favorite-button"
                    onClick={toggleFavorite}
                >
                    <Heart className={isFavorite ? 'filled' : 'empty'}/>
                </button>
            )}
        </div>
    );
};

ProductControls.propTypes = {
    productId: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
};

export default ProductControls;
