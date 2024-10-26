import PropTypes from "prop-types";
import '../styles/button.css';

const Button = (x) => {
  return (
      <button className={`styled-button ${x.className}`} onClick={x.func}>
        {x.children}
      </button>
  );
};

Button.propTypes = {
  func: PropTypes.func,
};

export default Button;
