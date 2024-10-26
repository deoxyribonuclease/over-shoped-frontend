import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/productcard.css';

function ProductCard({ product }) {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        navigate('/item');
    };

    //знижка
    const discountedPrice = product.isOnSale ? product.price * (1 - product.salePercent) : product.price;

    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
                <p className="brand-name">{product.brand}</p>
                <h3 className="product-name">
                    <a href="#">{product.name}</a>
                </h3>
                <p className="product-price">
                    Ціна:
                    {product.isOnSale ? (
                        <>
                            <span className="original-price">{product.price} ₴</span>
                            <span className="discounted-price">{discountedPrice.toFixed(2)} ₴</span>
                        </>
                    ) : (
                        <span>{product.price} ₴</span>
                    )}
                </p>
                <p className="product-rating">
                    Рейтинг: <span className="rating-value">{product.rating} ★</span>
                </p>
                <button className="buy-button" onClick={handleBuyNow}>Купити зараз</button>
            </div>
        </div>
    );
}

export default ProductCard;
