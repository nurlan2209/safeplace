import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/forum-section.css';

const ForumCategory = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);

  const categoryNames = {
    health: 'Здоровье',
    relationships: 'Отношения',
    support: 'Советы и поддержка',
    stories: 'Личные истории'
  };

  const categoryIcons = {
    health: '💬',
    relationships: '💗',
    support: '🌿',
    stories: '📖'
  };

  useEffect(() => {
    // Здесь будет загрузка постов с бэкенда
    // Временные данные
    setPosts([
      {
        id: 1,
        title: 'Как справиться с тревогой?',
        author: 'Анонимно',
        date: '2024-01-15',
        replies: 12
      },
      {
        id: 2,
        title: 'Поделитесь опытом',
        author: 'Мария',
        date: '2024-01-14',
        replies: 5
      }
    ]);
  }, [category]);

  return (
    <>
      <Header isLogged={true} />
      <main className="forum-section">
        <div className="back-link">
          <Link to="/forum">← Назад к форуму</Link>
        </div>

        <h1>{categoryIcons[category]} {categoryNames[category]}</h1>

        <div className="posts-list">
          {posts.length === 0 ? (
            <p>Пока нет постов в этой категории.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span>Автор: {post.author}</span>
                  <span>Дата: {post.date}</span>
                  <span>Ответов: {post.replies}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default ForumCategory;
