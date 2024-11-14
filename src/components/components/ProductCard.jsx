import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/productcard.css';
import prodImg from "../../assets/itemPlaceholder.png"
import { fetchShopById } from "../../api/shopApi.jsx";

function ProductCard({ product, shop }) {
    const navigate = useNavigate();
    const [shopInfo, setShopInfo] = useState(null);

    useEffect(() => {
        const fetchShopInfo = async () => {
            try {
                const shopData = await fetchShopById(product.shopId);
                setShopInfo(shopData);
            } catch (error) {
                console.error("Error fetching shop info:", error);
            }
        };

        fetchShopInfo();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    const defaultProduct = {
        id: 0,
        shop: shopInfo?.shopName || "Магазин не вказано",
        name: "Назва не вказана",
        price: 0,
        discountPercentage: 0,
        rating: 0.0,
        images: prodImg,
    };



    const currentProduct = {
        ...defaultProduct,
        ...product,
        rating: product.rating ?? 0
    };

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
                    Рейтинг: <span className="rating-value">{currentProduct.rating.toFixed(2)} ★</span>
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
