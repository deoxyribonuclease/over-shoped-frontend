
import PropTypes from "prop-types";
import ProductControls from "./ProductControls.jsx";
import '../styles/productinfo.css';

const ProductInfo = (x) => {
  return (
      <div className="info-wrapper">
        <div className="inner-info">
          <h2 className="company-name">{x.companyName}</h2>
          <p className="product-name">{x.productName}</p>
          <p className="product-description">{x.productDescription}</p>
          <div className="pricing">
            <p className="price">
              {x.isOnSale
                  ? (x.productPrice * (1 - x.salePercent)).toFixed(2)
                  : x.productPrice.toFixed(2)}₴
            </p>

            {x.isOnSale && (
                <p className="percent">{(x.salePercent * 100).toFixed(2) + "%"}</p>
            )}
            {x.isOnSale && (
                <p className="original-price">₴{x.productPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
        <ProductControls {...x} />
      </div>
  );
};

ProductInfo.propTypes = {
  companyName: PropTypes.string,
  productName: PropTypes.string,
  productDescription: PropTypes.string,
  productPrice: PropTypes.number,
  isOnSale: PropTypes.bool,
  salePercent: PropTypes.number,
};

ProductInfo.defaultProps = {
  companyName: "N/A",
  productName: "N/A",
  productDescription: "No description available.",
  productPrice: 0,
  isOnSale: false,
  salePercent: 0,
};

export default ProductInfo;
