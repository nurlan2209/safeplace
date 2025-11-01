import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/article_full.css';

const ArticlePage = () => {
  const { category, id } = useParams();
  const [article, setArticle] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Данные статей (в реальном приложении будут загружаться с бэкенда)
  const articles = {
    health: {
      1: {
        title: 'Как заботиться о своём теле',
        content: 'Простые ежедневные привычки для гармоничного состояния и энергии. Забота о теле начинается с простых шагов...',
        image: require('../assets/images/health1.jpg')
      },
      2: {
        title: 'Здоровое питание',
        content: 'Рекомендации по сбалансированному питанию для женского здоровья...',
        image: require('../assets/images/health2.jpg')
      },
      3: {
        title: 'Физическая активность',
        content: 'Как найти мотивацию для регулярных тренировок...',
        image: require('../assets/images/health3.jpg')
      }
    },
    relations: {
      1: {
        title: 'Как понять, что отношения здоровые',
        content: 'Признаки уважения, доверия и взаимной поддержки в паре...',
        image: require('../assets/images/rel1.jpg')
      },
      2: {
        title: 'Границы в отношениях',
        content: 'Как устанавливать и защищать личные границы...',
        image: require('../assets/images/rel2.jpg')
      },
      3: {
        title: 'Токсичные отношения',
        content: 'Признаки токсичных отношений и как из них выйти...',
        image: require('../assets/images/rel3.jpg')
      }
    },
    support: {
      1: {
        title: 'Как справиться с тревогой',
        content: 'Дыхательные практики, методы самоуспокоения и где найти помощь...',
        image: require('../assets/images/sup1.jpg')
      },
      2: {
        title: 'Методы релаксации',
        content: 'Эффективные техники снижения стресса...',
        image: require('../assets/images/sup2.jpg')
      },
      3: {
        title: 'Где искать помощь',
        content: 'Ресурсы психологической поддержки...',
        image: require('../assets/images/sup3.jpg')
      }
    },
    stories: {
      1: {
        title: 'Моя история выздоровления',
        content: 'Личный опыт преодоления сложностей...',
        image: require('../assets/images/story1.jpg')
      },
      2: {
        title: 'Как я нашла себя',
        content: 'История о пути к самопринятию...',
        image: require('../assets/images/story2.jpg')
      },
      3: {
        title: 'Преодоление страхов',
        content: 'Мой путь борьбы с тревожностью...',
        image: require('../assets/images/story3.jpg')
      }
    }
  };

  useEffect(() => {
    if (articles[category] && articles[category][id]) {
      setArticle(articles[category][id]);
    }
  }, [category, id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Здесь будет запрос к бэкенду для добавления/удаления из избранного
  };

  if (!article) {
    return (
      <>
        <Header isLogged={true} />
        <main>
          <p>Статья не найдена</p>
          <Link to="/user-home">← Назад на главную</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header isLogged={true} />
      <main className="article-page">
        <div className="back-link">
          <Link to="/user-home">← Назад</Link>
        </div>

        <article className="article-content">
          <img src={article.image} alt={article.title} className="article-image" />
          <h1>{article.title}</h1>
          <div className="article-text">
            {article.content}
          </div>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? '💖 В избранном' : '🤍 Добавить в избранное'}
          </button>
        </article>
      </main>
    </>
  );
};

export default ArticlePage;
