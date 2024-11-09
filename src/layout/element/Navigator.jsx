import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Logo, Menu, Cart } from "../../icons/index.jsx";
import FloatingCart from "../../components/components/FloatingCart.jsx";
import { avatar } from "../../assets/imagedata.js";
import { useNavigate } from "react-router-dom";
import Heart from "../../icons/Heart.jsx";
import List from "../../icons/List.jsx";
import { getUserImageId } from "../../api/userApi.jsx";
import { jwtDecode } from "jwt-decode";
import "../styles/navigator.css";


const navLinks = ["Каталог", "me", "please"];

const Navigator = ({ openModal }) => {
  const [showingCart, setShowingCart] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [totalCartSize, setTotalCartSize] = useState(0);

  const token = Cookies.get('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (token) {
        try {
          const userId = jwtDecode(token).user.id;
          const userData = await getUserImageId(userId);
          setAvatarUrl(userData);
        } catch (error) {
          console.error("Failed to fetch user avatar:", error);
        }
      }
    };
    fetchUserAvatar();

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setTotalCartSize(storedCart.reduce((total, item) => total + item.quantity, 0));
  }, [token]);

  useEffect(() => {
    const updateCartSize = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setTotalCartSize(storedCart.reduce((total, item) => total + item.quantity, 0));
    };
    updateCartSize();
    window.addEventListener('storage', updateCartSize);

    return () => {
      window.removeEventListener('storage', updateCartSize);
    };
  }, []);

  const handleAvatarClick = () => {
    if (token) {
      navigate('/profile');
    } else {
      openModal();
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };




  return (
      <header className="navigator-wrapper">
        <nav>
          <div className="nav-left">
            <button onClick={() => setShowingCart(!showingCart)} className="menu-btn">
              <Menu/>
            </button>
            <div className="logo" onClick={handleLogoClick}>
              <Logo/>
            </div>



            <ul className="nav-links">
              {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="/open">{link}</a>
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
                onClick={() => setShowingCart(!showingCart)}
                className="cart-btn"
            >
              <Cart/>
              {totalCartSize > 0 && <span>{totalCartSize}</span>}
            </button>
            <button className="avatar-btn" onClick={handleAvatarClick}>
              {avatarUrl !== null ? (
                  <img src={avatarUrl} alt="User Avatar"/>
              ) : (
                  <img src={avatar} alt="User Avatar"/>
              )}
            </button>
            <FloatingCart setShowingCart={setShowingCart}
                          showingCart={showingCart}
                          className={showingCart ? "active" : ""}/>
          </div>
        </nav>
      </header>
  );
};

export default Navigator;
