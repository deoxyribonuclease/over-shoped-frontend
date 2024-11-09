import '../styles/footer.css';
import React, { useEffect } from "react";
import { initGoogleTranslate } from "../../utils/translation.js";
import Internet from "../../assets/internet.svg";

const Footer = () => {

  useEffect(() => {
    initGoogleTranslate();
  }, []);

  return (
      <footer className="footer">
        <div className="footer-content">

          {/* Ліва частина футера */}
          <div className="footer-left">
            <nav className="footer-nav">
              <ul>
                <li><a href="#about">Про Нас</a></li>
                <li><a href="#services">Сервіси</a></li>
                <li><a href="#contact">Контакти</a></li>
                <li><a href="#privacy">Політика конфіденційності</a></li>
              </ul>
            </nav>
            <div className="social-media">
              <a href="#facebook" aria-label="Facebook">Facebook</a>
              <a href="#twitter" aria-label="Twitter">Twitter</a>
              <a href="#instagram" aria-label="Instagram">Instagram</a>
            </div>
          </div>

          {/* Права частина футера */}
          <div className="footer-right">
            <div className="footer-image">
              <img src={Internet} alt="Footer Image" />
            </div>
            <div className="language-selector">
              <button alt="uk" data-google-lang="uk">Укр</button>
              <button alt="en" data-google-lang="en">Eng</button>
              <button alt="ru" data-google-lang="ru">Рус</button>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
        <p className="copyright">
          &copy; {new Date().getFullYear()} Over-Shoped. Всі права захищені.
        </p>
      </footer>
  );
};

export default Footer;
