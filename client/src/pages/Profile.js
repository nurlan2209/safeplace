import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import ava from '../assets/images/ava.jpg';
import '../assets/css/profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <Header isLogged={true} />
      <main className="profile-page">
        <div className="profile-container">
          {/* Левая колонка */}
          <aside className="profile-sidebar">
            <div className="avatar">
              <img src={user?.avatar || ava} alt="Аватар" />
            </div>
            <h2 className="username">{user?.name || 'Никнейм пользователя'}</h2>
            <p className="user-email">{user?.email || 'user@email.com'}</p>

            <div className="profile-actions">
              <Link to="/edit-profile" className="btn-profile">Редактировать профиль</Link>
              <Link to="/change-password" className="btn-profile">Изменить пароль</Link>
              <Link to="/" className="btn-profile logout-btn">Выйти</Link>
            </div>
          </aside>

          {/* Правая часть */}
          <section className="profile-details">
            <h2>Обо мне</h2>
            <p className="profile-text">
              {user?.bio || 'Здесь может быть краткая информация о пользователе: интересы, род деятельности или личное описание.'}
            </p>

            <h2>Активность</h2>
            <ul className="profile-stats">
              <li><strong>Постов:</strong> {user?.postsCount || 0}</li>
              <li><strong>Комментариев:</strong> {user?.commentsCount || 0}</li>
              <li><strong>В избранном:</strong> {user?.favoritesCount || 0}</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
};

export default Profile;
