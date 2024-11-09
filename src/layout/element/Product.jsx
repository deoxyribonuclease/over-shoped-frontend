import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../../components/components/ImageCarousel.jsx";
import ProductInfo from "../../components/components/ProductInfo.jsx";
import { productImages } from "../../assets/imagedata";
import { fetchProductById } from "../../Api/ItemsApi.jsx";
import ReviewForm from "../../components/components/ReviewForm.jsx";
import "../styles/product.css";
import Empty from "../../assets/empty.jpg";

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const fetchedProduct = await fetchProductById(id);
                setProduct({ ...fetchedProduct, images: fetchedProduct.images.length ? fetchedProduct.images : productImages });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Завантаження...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="no-products-placeholder-item">
                <p>Помилка завантаження товару. Спробуйте пізніше.</p>
                <img src={Empty} alt="empty" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="no-products-placeholder-item">
                <p>Товару не існує</p>
                <img src={Empty} alt="empty" />
            </div>
        );
    }

    return (
        <div>
            <div className="product-wrapper">
                <ImageCarousel
                    productImages={product.images}
                    productThumbnails={product.images}
                />
                <ProductInfo {...product} />
            </div>
            <ReviewForm productId={id} />
        </div>
    );
};

export default Product;
