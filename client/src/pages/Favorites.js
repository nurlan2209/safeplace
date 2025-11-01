import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/favorites.css';
import health1 from '../assets/images/health1.jpg';
import rel1 from '../assets/images/rel1.jpg';
import sup1 from '../assets/images/sup1.jpg';

const Favorites = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      category: 'health',
      title: 'Как заботиться о своём теле',
      description: 'Простые ежедневные привычки для гармоничного состояния и энергии.',
      image: health1,
      articleId: 1
    },
    {
      id: 2,
      category: 'relations',
      title: 'Как понять, что отношения здоровые',
      description: 'Признаки уважения, доверия и взаимной поддержки в паре.',
      image: rel1,
      articleId: 1
    },
    {
      id: 3,
      category: 'support',
      title: 'Как справиться с тревогой',
      description: 'Дыхательные практики, методы самоуспокоения и где найти помощь.',
      image: sup1,
      articleId: 1
    }
  ]);

  const handleDelete = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  return (
    <>
      <Header isLogged={true} />
      <header className="header">
        <h1>💖 Мои сохранённые статьи</h1>
      </header>

      <main className="favorites-page">
        <div className="back-link">
          <Link to="/user-home">← Назад на главную</Link>
        </div>

        <div className="favorites-grid">
          {favorites.length === 0 ? (
            <p>У вас пока нет сохраненных статей</p>
          ) : (
            favorites.map(item => (
              <div key={item.id} className="favorite-card">
                <img src={item.image} alt={item.title} />
                <div className="content">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <div className="buttons">
                    <Link to={`/article/${item.category}/${item.articleId}`} className="read">
                      Читать →
                    </Link>
                    <button className="delete" onClick={() => handleDelete(item.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default Favorites;
