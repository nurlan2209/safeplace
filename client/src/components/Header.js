import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo_safeplace.png";
// Убедитесь, что CSS импортирован, если вы его еще не импортировали в App.js
// import '../assets/css/style.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // === НОВОЕ: Состояние для мобильного меню ===
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // === НОВОЕ: Навигационные ссылки вынесены в отдельный компонент ===
  const NavLinks = ({ isMobile }) => (
    <>
      <Link to="/user-home" onClick={isMobile ? closeMobileMenu : undefined}>
        Главная
      </Link>
      <Link to="/forum" onClick={isMobile ? closeMobileMenu : undefined}>
        Форум
      </Link>
      <Link to="/messages" onClick={isMobile ? closeMobileMenu : undefined}>
        Сообщения
      </Link>
      <Link to="/articles" onClick={isMobile ? closeMobileMenu : undefined}>
        Статьи
      </Link>
      <Link to="/favorites" onClick={isMobile ? closeMobileMenu : undefined}>
        Избранное
      </Link>
      <Link to="/help" onClick={isMobile ? closeMobileMenu : undefined}>
        Помощь
      </Link>
      <Link to="/profile" onClick={isMobile ? closeMobileMenu : undefined}>
        Профиль
      </Link>
      <button
        onClick={() => {
          handleLogout();
          if (isMobile) closeMobileMenu();
        }}
        className="btn-logout"
      >
        Выйти
      </button>
    </>
  );

  return (
    <header className="header">
      <div className="header-container">
        <Link to={user ? "/user-home" : "/"} className="logo">
          <img src={logo} alt="SafePlace Logo" />
        </Link>

        {user && (
          <>
            {/* === 1. ДЕСКТОПНАЯ НАВИГАЦИЯ (будет скрыта на мобильных) === */}
            <nav className="header-nav-desktop">
              <NavLinks isMobile={false} />
            </nav>

            {/* === 2. КНОПКА БУРГЕР (будет видна только на мобильных) === */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? "✖" : "☰"} {/* Иконка меняется */}
            </button>

            {/* === 3. МОБИЛЬНОЕ МЕНЮ (появляется при нажатии) === */}
            {isMobileMenuOpen && (
              <div className="mobile-nav-overlay">
                <nav className="mobile-nav-menu">
                  <NavLinks isMobile={true} />
                </nav>
              </div>
            )}
          </>
        )}

        {!user && (
          <nav className="header-nav-public">
            <Link to="/login" className="btn btn-secondary">
              Войти
            </Link>
            <Link to="/register" className="btn btn-primary">
              Регистрация
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
