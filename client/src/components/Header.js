import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo_safeplace.png';

const Header = ({ isLogged = false }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLogged) {
    return (
      <header className="header-logged">
        <div className="logo">
          <img src={logo} alt="SafePlace" />
        </div>
        <nav>
          <Link to="/user-home">Главная</Link>
          <Link to="/forum">Форум</Link>
          <Link to="/messages">Сообщения</Link>
          <Link to="/favorites">Избранное</Link>
          <Link to="/help">Помощь</Link>
          <Link to="/profile">Профиль</Link>
          <button onClick={handleLogout} className="logout">Выход</button>
        </nav>
      </header>
    );
  }

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="SafePlace" />
      </div>
      <nav>
        <Link to="/" className="active">Главная</Link>
        <Link to="/about">О проекте</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Вход</Link>
      </nav>
    </header>
  );
};

export default Header;
