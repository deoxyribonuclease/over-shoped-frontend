// Product.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../../components/components/ImageCarousel.jsx";
import ProductInfo from "../../components/components/ProductInfo.jsx";
import { productImages } from "../../assets/imagedata";
import { fetchProductById } from "../../Api/ItemsApi.jsx";
import "../styles/product.css";

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
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Помилка: {error}</div>;
    }

    if (!product) {
        return <div>Продукту не занйдено</div>;
    }

    return (
        <div className="product-wrapper">
            <ImageCarousel
                productImages={product.images}
                productThumbnails={product.images}
            />
            <ProductInfo {...product} />
        </div>
    );
};

export default Product;
