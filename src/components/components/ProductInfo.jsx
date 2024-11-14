import PropTypes from "prop-types";
import ProductControls from "./ProductControls.jsx";
import '../styles/productinfo.css';

const ProductInfo = (x) => {
  return (
      <div className="info-wrapper">
        <div className="inner-info">
          <h2 className="company-name">{x?.shopName}</h2>
          <p className="product-name">{x.productName}</p>
          <p className="product-description">{x.productDescription}</p>

          <div className="rating-stock-section">
            <div className="rating">
              <span className="rating-title">Рейтинг:</span>
              <span className="rating-value">
              {x.rating ? x.rating.toFixed(1) : "0.0"} ★
            </span>
            </div>
            <div className="stock">
            <span className="stock-status">
              {x.amount > 0 ? `${x.amount} в наявності` : "Немає в наявності"}
            </span>
            </div>
          </div>

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
  shopId: PropTypes.number,
  productName: PropTypes.string,
  productDescription: PropTypes.string,
  productPrice: PropTypes.number,
  isOnSale: PropTypes.bool,
  salePercent: PropTypes.number,
  amount: PropTypes.number,
  rating: PropTypes.number,
};

ProductInfo.defaultProps = {
  shopId: "N/A",
  productName: "N/A",
  productDescription: "No description available.",
  productPrice: 0,
  isOnSale: false,
  salePercent: 0,
  amount: 0,
  rating: null,
};

export default ProductInfo;
