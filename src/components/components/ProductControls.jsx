import PropTypes from "prop-types";
import { Plus, Minus, Cart } from "../../icons/index";
import Button from "./Button.jsx";
import { useGlobalContext } from "../../context/context";
import { data } from "../../utils/data";
import '../styles/productcontrols.css';

const ProductControls = (x) => {
    const { increaseAmount, decreaseAmount, addToCart, state } = useGlobalContext();

    return (
        <div className="controls-wrapper">
            <div className="inner-controls">
                <button onClick={() => decreaseAmount(x.productId)}>
                    <Minus />
                </button>
                <span className="amount">{state.amount}</span>
                <button onClick={() => increaseAmount(x.productId)}>
                    <Plus />
                </button>
            </div>
            <Button
                className="cart"
                func={() => addToCart(state.amount, data)}
                color={"#FFFFFF"}
            >
                <Cart />
                Додати в Кошик
            </Button>
        </div>
    );
};

ProductControls.propTypes = {
    productId: PropTypes.string.isRequired,
};

export default ProductControls;
