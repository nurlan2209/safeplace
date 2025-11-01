import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/forum.css';

const Forum = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Здоровье',
    content: '',
    anonymous: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Здесь будет отправка на бэкенд
    console.log('Post data:', formData);
    setIsModalOpen(false);
    // Сброс формы
    setFormData({
      title: '',
      category: 'Здоровье',
      content: '',
      anonymous: false
    });
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

      {/* Модальное окно создания темы */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Создать новую тему</h2>
            <form onSubmit={handleSubmit}>
              <label>Заголовок</label>
              <input
                type="text"
                name="title"
                placeholder="Введите тему"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Категория</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option>Здоровье</option>
                <option>Отношения</option>
                <option>Советы и поддержка</option>
                <option>Личные истории</option>
              </select>

              <label>Сообщение</label>
              <textarea
                name="content"
                rows="5"
                placeholder="Напишите свой пост"
                value={formData.content}
                onChange={handleChange}
                required
              />

              <label className="anon">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                />
                Опубликовать анонимно
              </label>

              <button type="submit" className="btn">Опубликовать</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Forum;
