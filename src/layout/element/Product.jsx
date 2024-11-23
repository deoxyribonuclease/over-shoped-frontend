import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageCarousel from "../../components/components/ImageCarousel.jsx";
import ProductInfo from "../../components/components/ProductInfo.jsx";
import { productImages } from "../../assets/imagedata";
import { fetchProductById } from "../../Api/ItemsApi.jsx";
import ReviewForm from "../../components/components/ReviewForm.jsx";
import "../styles/product.css";
import Empty from "../../assets/empty.jpg";
import { fetchShopById } from "../../api/shopApi.jsx";
import ProductPropertiesTable from "../../components/components/ProductPropertiesTable.jsx";

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [shopInfo, setShopInfo] = useState(null);



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

    useEffect(() => {
        const fetchShopInfo = async () => {
            if (product && product.shopId) {
                try {
                    const shopData = await fetchShopById(product.shopId);
                    setShopInfo(shopData);
                } catch (error) {
                    console.error("Error fetching shop info:", error);
                }
            }
        };

        if (product) {
            fetchShopInfo();
        }
    }, [product]);


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
                <ProductInfo {...product} {...shopInfo}/>
            </div>
            <ProductPropertiesTable productId={id} />
            <ReviewForm productId={id} />
        </div>
    );
};

export default Product;
