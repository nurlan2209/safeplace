import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { postsAPI } from '../utils/api';
import '../assets/css/forum.css';

const Forum = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'health',
    content: '',
    anonymous: false
  });

  const categoryToEnglish = {
    'Здоровье': 'health',
    'Отношения': 'relationships',
    'Советы и поддержка': 'support',
    'Личные истории': 'stories'
  };

  const categoryToRussian = {
    'health': 'Здоровье',
    'relationships': 'Отношения',
    'support': 'Советы и поддержка',
    'stories': 'Личные истории'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send English category key to backend
      const postData = {
        ...formData,
        category: categoryToEnglish[formData.category] || formData.category
      };
      await postsAPI.create(postData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        category: 'health',
        content: '',
        anonymous: false
      });

      navigate(`/forum/${postData.category}`);
    } catch (err) {
      setError('Ошибка при создании поста: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="forum">
        <div className="back-link">
          <Link to="/user-home">← Назад на главную</Link>
        </div>

        <div className="forum-header">
          <h1>Форум SafePlace</h1>
          <button className="btn" onClick={() => setIsModalOpen(true)}>
            Создать тему
          </button>
        </div>

        <section className="categories">
          <div className="category">
            <Link to="/forum/health" className="category-card">
              <h2>💬 Здоровье</h2>
              <p>Обсуждения о теле, питании и психологическом состоянии.</p>
            </Link>
          </div>

          <div className="category">
            <Link to="/forum/relationships" className="category-card">
              <h2>💗 Отношения</h2>
              <p>Доверительные разговоры о дружбе, любви и семье.</p>
            </Link>
          </div>

          <div className="category">
            <Link to="/forum/support" className="category-card">
              <h2>🌿 Советы и поддержка</h2>
              <p>Темы от модераторов: как справиться с тревогой, где найти помощь.</p>
            </Link>
          </div>

          <div className="category">
            <Link to="/forum/stories" className="category-card">
              <h2>📖 Личные истории</h2>
              <p>Место, где можно выговориться и поделиться опытом.</p>
            </Link>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Создать новую тему</h2>
            {error && <div className="error-message" style={{color: '#d9534f', marginBottom: '10px'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <label>Заголовок</label>
              <input
                type="text"
                name="title"
                placeholder="Введите тему"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <label>Категория</label>
              <select name="category" value={formData.category} onChange={handleChange} disabled={isLoading}>
                <option value="health">Здоровье</option>
                <option value="relationships">Отношения</option>
                <option value="support">Советы и поддержка</option>
                <option value="stories">Личные истории</option>
              </select>

              <label>Сообщение</label>
              <textarea
                name="content"
                rows="5"
                placeholder="Напишите свой пост"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <label className="anon">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                Опубликовать анонимно
              </label>

              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? 'Публикация...' : 'Опубликовать'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Forum;
