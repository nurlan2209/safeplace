import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setMessage('Пароль успешно изменен!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка изменения пароля');
    }
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="form-page">
        <div className="form-container">
          <h2>Изменить пароль</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>Текущий пароль</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Введите текущий пароль"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />

            <label>Новый пароль</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Введите новый пароль"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength="6"
            />

            <label>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Подтвердите новый пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />

            <button type="submit" className="btn">Изменить пароль</button>
          </form>
          <div className="back-link">
            <Link to="/profile">← Назад к профилю</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default ChangePassword;
