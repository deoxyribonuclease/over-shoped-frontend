import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/productcard.css';
import prodImg from "../../assets/itemPlaceholder.png"
function ProductCard({ product }) {
    const navigate = useNavigate();

    const defaultProduct = {
        id: 0,
        shop: "Магазин не вказано",
        name: "Назва не вказана",
        price: 0,
        discountPercentage: 0,
        rating: "N/A",
        images: prodImg,
    };

    const currentProduct = { ...defaultProduct, ...product };

    const handleBuyNow = () => {
        navigate(`/item/${currentProduct.id}`);
    };


    const discountedPrice = currentProduct.discountPercentage > 0
        ? currentProduct.price * (1 - currentProduct.discountPercentage / 100)
        : currentProduct.price;

    return (
        <div className="product-card">
            <div onClick={handleBuyNow} className="product-image">
                <img
                    src={currentProduct.images?.[0] || prodImg}
                    alt={currentProduct.name}
                />
            </div>
            <div className="product-info">
                <p className="brand-name">{currentProduct.shop}</p>
                <h3 onClick={handleBuyNow} className="product-name">
                    <a>{currentProduct.name}</a>
                </h3>
                <p className="product-price">
                    Ціна:
                    {currentProduct.discountPercentage > 0 ? (
                        <>
                            <span className="original-price">{currentProduct.price} ₴</span>
                            <span className="discounted-price">{discountedPrice.toFixed(2)} ₴</span>
                        </>
                    ) : (
                        <span>{currentProduct.price} ₴</span>
                    )}
                </p>
                <p className="product-rating">
                    Рейтинг: <span className="rating-value">{currentProduct.rating} ★</span>
                </p>
                <button
                    className="buy-button"
                    onClick={handleBuyNow}
                >
                    Купити зараз
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
