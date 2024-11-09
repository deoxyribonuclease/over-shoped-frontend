import React, { useEffect, useState } from 'react';
import { Delete } from "../../icons/index.jsx";
import PropTypes from "prop-types";
import '../styles/singlcartitem.css';
import { fetchProductById } from "../../api/ItemsApi.jsx";
import prodImg from "../../assets/itemPlaceholder.png";
import { useNavigate } from "react-router-dom";

const SingleCartItem = ({ productId, quantity, onRemoveItem, onUpdateQuantity, handleClose }) => {
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            const productData = await fetchProductById(productId);
            setProduct(productData);
        };

        fetchData();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const { productName, productPrice, isOnSale, salePercent, images } = product;

    const actualPrice = isOnSale
        ? (productPrice * (1 - salePercent)).toFixed(2)
        : productPrice.toFixed(2);

    const totalPrice = (actualPrice * quantity).toFixed(2);

    const handleIncrement = () => {
        onUpdateQuantity(productId, quantity + 1);
        window.dispatchEvent(new Event('storage'));
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onUpdateQuantity(productId, quantity - 1);
            window.dispatchEvent(new Event('storage'));
        }
    };

    const removeItem = () => {
        onRemoveItem(productId);
    };

    const itemRoute = () => {
        navigate('/item/'+productId);
        handleClose();
    };

    return (
        <li className="single-item-wrapper">
            <img onClick={itemRoute} src={images[0] || prodImg} alt={images[0]?.alt || 'Product Image'} />
            <div className="item-info">
                <p onClick={itemRoute} className="name">{productName}</p>
                <p className="total">
                    {actualPrice} ₴ &nbsp;x&nbsp;
                    <button onClick={handleDecrement} className="quantity-button">-</button>
                    <span className="quantity-number">{quantity}</span>
                    <button onClick={handleIncrement} className="quantity-button">+</button>
                    &nbsp;<span>{totalPrice} ₴</span>
                </p>
            </div>
            <button className="button" onClick={removeItem}>
                <Delete />
            </button>
        </li>
    );
};

SingleCartItem.propTypes = {
    productId: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
};

export default SingleCartItem;
