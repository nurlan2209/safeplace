import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { favoritesAPI, articlesAPI } from '../utils/api';
import '../assets/css/favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const favData = await favoritesAPI.getAll();

      // Загружаем детали статей/постов для каждого избранного
      const detailedFavorites = await Promise.all(
        favData.map(async (fav) => {
          try {
            // Пытаемся загрузить как статью
            if (fav.articleCategory === 'article') {
              const article = await articlesAPI.getById(fav.articleId);
              return {
                ...fav,
                title: article.title,
                description: article.content.substring(0, 150) + '...',
                imageUrl: article.imageUrl
              };
            }
            // Можно добавить загрузку постов тоже если нужно
            return fav;
          } catch {
            return fav;
          }
        })
      );

      setFavorites(detailedFavorites);
    } catch (err) {
      setError('Ошибка загрузки избранного: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleCategory, articleId) => {
    try {
      await favoritesAPI.remove(articleCategory, articleId);
      setFavorites(favorites.filter(item =>
        !(item.articleCategory === articleCategory && item.articleId === articleId)
      ));
    } catch (err) {
      setError('Ошибка удаления из избранного: ' + err.message);
    }
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

        {error && <div style={{color: '#d9534f', marginBottom: '10px'}}>{error}</div>}

        {loading ? (
          <p>Загрузка избранного...</p>
        ) : (
          <div className="favorites-grid">
            {favorites.length === 0 ? (
              <p>У вас пока нет сохраненных статей</p>
            ) : (
              favorites.map(item => (
                <div key={`${item.articleCategory}-${item.articleId}`} className="favorite-card">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title || 'Статья'} />}
                  <div className="content">
                    <h2>{item.title || 'Статья'}</h2>
                    <p>{item.description || 'Описание недоступно'}</p>
                    <div className="buttons">
                      <Link
                        to={`/article/${item.articleCategory}/${item.articleId}`}
                        className="read"
                      >
                        Читать →
                      </Link>
                      <button
                        className="delete"
                        onClick={() => handleDelete(item.articleCategory, item.articleId)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Favorites;
