import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
      <footer className="footer">
        <div className="footer-content">
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
          <p className="copyright">&copy; {new Date().getFullYear()} Over-Shoped. Всі права захищені.</p>
        </div>
      </footer>
  );
};

export default Footer;
