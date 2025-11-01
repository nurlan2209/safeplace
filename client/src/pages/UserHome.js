import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const UserHome = () => {
  return (
    <>
      <Header isLogged={true} />
      <main className="user-home">
        <section className="left">
          <h1>SafePlace —<br /> your safety in your hands</h1>
          <p className="subtitle">Место, где тебя понимают</p>
          <div className="buttons">
            <Link to="/profile" className="btn">Профиль</Link>
            <Link to="/" className="btn btn-light">Выйти</Link>
          </div>
        </section>

        <section className="right">
          <div className="user-sections">
            <div className="section-card">
              <h3>Форум</h3>
              <p>Истории, статьи, обсуждения.</p>
              <Link to="/forum" className="tile-btn">Перейти</Link>
            </div>
            <div className="section-card">
              <h3>Мои сохранённые</h3>
              <p>Избранное и важные записи.</p>
              <Link to="/favorites" className="tile-btn">Перейти</Link>
            </div>
            <div className="section-card">
              <h3>Сообщения</h3>
              <p>Анонимное общение с людьми.</p>
              <Link to="/messages" className="tile-btn">Перейти</Link>
            </div>
            <div className="section-card">
              <h3>Помощь</h3>
              <p>Психологи, горячие линии, международные ресурсы.</p>
              <Link to="/help" className="tile-btn">Перейти</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UserHome;
