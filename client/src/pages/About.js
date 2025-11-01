import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const About = () => {
  return (
    <>
      <Header isLogged={false} />
      <main className="about-page">
        <div className="about-container">
          <h1>О проекте SafePlace</h1>
          <p>
            SafePlace — это безопасное пространство для женщин, где можно получить поддержку,
            поделиться историями и найти помощь в сложных ситуациях.
          </p>
          <p>
            Наша миссия — создать сообщество взаимопомощи, где каждая женщина может
            чувствовать себя понятой и защищенной.
          </p>
          <h2>Что мы предлагаем:</h2>
          <ul>
            <li>Анонимный форум для обсуждения важных тем</li>
            <li>Безопасные чаты для общения</li>
            <li>Статьи о здоровье, отношениях и самопомощи</li>
            <li>Контакты горячих линий и психологов</li>
          </ul>
          <div className="back-link">
            <Link to="/">← Вернуться на главную</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;
