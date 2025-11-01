import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage('Профиль успешно обновлен!');
      setTimeout(() => navigate('/profile'), 1500);
    } else {
      setMessage(result.error);
    }
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="form-page">
        <div className="form-container">
          <h2>Редактировать профиль</h2>
          {message && <div className="message">{message}</div>}
          <form onSubmit={handleSubmit}>
            <label>Имя</label>
            <input
              type="text"
              name="name"
              placeholder="Введите имя"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>О себе</label>
            <textarea
              name="bio"
              rows="5"
              placeholder="Расскажите о себе"
              value={formData.bio}
              onChange={handleChange}
            />

            <button type="submit" className="btn">Сохранить изменения</button>
          </form>
          <div className="back-link">
            <Link to="/profile">← Назад к профилю</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditProfile;
