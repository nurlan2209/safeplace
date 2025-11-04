import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo_safeplace.png";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Компонент навигационных ссылок
  const NavLinks = ({ isMobile }) => (
    <>
      <Link
        to="/user-home"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={window.location.pathname === "/user-home" ? "active" : ""}
      >
        Главная
      </Link>
      <Link
        to="/forum"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={window.location.pathname.includes("/forum") ? "active" : ""}
      >
        Форум
      </Link>
      <Link
        to="/messages"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={window.location.pathname === "/messages" ? "active" : ""}
      >
        Сообщения
      </Link>
      <Link
        to="/favorites"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={window.location.pathname === "/favorites" ? "active" : ""}
      >
        Избранное
      </Link>
      <Link
        to="/help"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={window.location.pathname === "/help" ? "active" : ""}
      >
        Помощь
      </Link>
      <Link
        to="/profile"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={window.location.pathname === "/profile" ? "active" : ""}
      >
        Профиль
      </Link>
      <button onClick={handleLogout} className="btn-logout">
        Выйти
      </button>
    </>
  );

  return (
    <header>
      <Link to={user ? "/user-home" : "/"} className="logo">
        <img src={logo} alt="SafePlace Logo" />
      </Link>

      {user ? (
        <>
          {/* Десктопная навигация */}
          <nav className="header-nav-desktop">
            <NavLinks isMobile={false} />
          </nav>

          {/* Кнопка бургер-меню */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? "✖" : "☰"}
          </button>

          {/* Мобильное меню */}
          {isMobileMenuOpen && (
            <div
              className="mobile-nav-overlay"
              style={{ display: "flex" }}
              onClick={closeMobileMenu}
            >
              <nav
                className="mobile-nav-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <NavLinks isMobile={true} />
              </nav>
            </div>
          )}
        </>
      ) : (
        <nav className="header-nav-public">
          <Link to="/login" className="btn btn-light">
            Войти
          </Link>
          <Link to="/register" className="btn btn-light">
            Регистрация
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
