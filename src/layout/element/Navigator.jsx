import React from "react";
import { Logo, Menu, Cart } from "../../icons/index.jsx";
import { avatar } from "../../assets/imagedata.js";
import FloatingCart from "../../components/components/FloatingCart.jsx";
import { useGlobalContext } from "../../context/context.jsx";
import "../styles/navigator.css";
import { useNavigate } from "react-router-dom";
import Heart from "../../icons/Heart.jsx";
import List from "../../icons/List.jsx";

const navLinks = ["Help", "me", "please"];

const Navigator = () => {
  const { showSidebar, showCart, hideCart, state } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
      <header className="navigator-wrapper">
        <nav>
          <div className="nav-left">
            <button onClick={showSidebar} className="menu-btn">
              <Menu/>
            </button>
            <div className="logo" onClick={handleLogoClick}>
              <Logo/>
            </div>
            <ul className="nav-links">
              {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#">{link}</a>
                  </li>
              ))}
            </ul>
          </div>
          <div className="nav-center">
            <form className="search-form">
              <input type="text" className="search-input" placeholder="Пошук..."/>
              <button type="submit" className="search-button">🔍︎ Пошук</button>
            </form>
          </div>
          <div className="nav-right">
            <a href="/orders" className="order-link">
              <List/>
            </a>
            <a href="/favorites" className="favorites-link">
              <Heart/>
            </a>
            <button
                onClick={() => (state.showingCart ? hideCart() : showCart())}
                className="cart-btn"
            >
              <Cart/>
              {state.totalCartSize > 0 && <span>{state.totalCartSize}</span>}
            </button>
            <button className="avatar-btn">
              <img src={avatar} alt="avatar"/>
            </button>
            <FloatingCart className={state.showingCart ? "active" : ""}/>
          </div>
        </nav>
      </header>
  );
};

export default Navigator;
