import ImageCarousel from "../../components/components/ImageCarousel.jsx";
import ProductInfo from "../../components/components/ProductInfo.jsx";
import { productImages, productThumbnails } from "../../assets/imagedata.js";
import { data } from "../../utils/data.js";
import "../styles/product.css";

const Product = () => {
    return (
        <div className="product-wrapper">
            <ImageCarousel productImages={productImages} productThumbnails={productThumbnails} />
            <ProductInfo {...data} />
        </div>
    );
};

export default Product;
