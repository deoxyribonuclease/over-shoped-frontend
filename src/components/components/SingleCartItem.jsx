
import { Delete } from "../../icons/index.jsx";
import { useGlobalContext } from "../../context/context.jsx";
import PropTypes from "prop-types";
import '../styles/singlcartitem.css';

const SingleCartItem = (x) => {
  const { removeItem } = useGlobalContext();

  const actualPrice = x.isOnSale
      ? (x.productPrice * x.salePercent).toFixed(2)
      : x.productPrice.toFixed(2);

  const totalPrice = (actualPrice * x.amount).toFixed(2);

  return (
      <li className="single-item-wrapper">
        <img src={(x.images)[0].url} alt={(x.images)[0].alt} />
        <div className="item-info">
          <p className="name">{x.productName}</p>
          <p className="total">
            ${actualPrice}
            &nbsp;x&nbsp;{x.amount}&nbsp;
            <span>${totalPrice}</span>
          </p>
        </div>
        <button className="button" onClick={() => removeItem(x.productId)}>
          <Delete />
        </button>
      </li>
  );
};

SingleCartItem.propTypes = {
  productId: PropTypes.number,
  productName: PropTypes.string,
  productPrice: PropTypes.number,
  amount: PropTypes.number,
  isOnSale: PropTypes.bool,
  images: PropTypes.array,
};

SingleCartItem.defaultProps = {
  productPrice: 0,
  amount: 0,
  isOnSale: false,
  images: [],
};

export default SingleCartItem;
