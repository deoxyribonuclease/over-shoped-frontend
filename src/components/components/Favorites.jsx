import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getUserFavorites } from "../../api/userApi.jsx";
import { fetchProductById } from "../../api/itemsApi.jsx";
import "../styles/favorites.css";
import prodImg from "../../assets/itemPlaceholder.png";

const Favorites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favoriteItems = await getUserFavorites(userId);
                const productIds = favoriteItems.map((item) => item.productId);
                const favoriteProducts = await Promise.all(
                    productIds.map((id) => fetchProductById(id))
                );

                setFavorites(favoriteProducts);
            } catch (err) {
                setError("Не вдалося завантажити улюблені товари.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);



    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Завантаження улюблених товарів...</p>
            </div>
        );
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (favorites.length === 0) {
        return  <div className="favorites-container" style={{alignItems:"center"}}><h3>У вас немає улюблених товарів.</h3></div>;
    }

    return (
        <div className="favorites-container">
            <h3>Ваші улюблені</h3>
            {favorites.map((product) => (
                <div className="favorites-container-item">
                    <div className="product-details">
                        <a href={`/item/${product.productId}`}>
                            <img
                                src={product.images?.[0] || prodImg}
                                alt={product.name}
                            />
                        </a>
                        <p className="prod-name">
                            <span className="product-title">Назва: </span>
                            {product.productName.length > 15
                                ? product.productName.slice(0, 15) + "..."
                                : product.productName}
                        </p>
                        <p className="product-info">
                            <span className="price-title">Ціна: </span>
                            {product.salePercent > 0
                                ? (product.productPrice * (1 - product.salePercent)).toFixed(2)
                                : product.productPrice.toFixed(2)
                            } ₴
                        </p>
                        <p className="product-info" style={{color: '#c0af63;'}}>
                            <span className="discount-title">Рейтинг: </span>
                            <span style={{color: '#c0af63'}}> {product.rating.toFixed(2)}★ </span>
                        </p>
                        <p className="product-info" style={{color: '#c0af63;'}}>
                            <span className="discount-title">В наявності: </span>
                            <span> {product.amount} </span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

Favorites.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default Favorites;
