import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(formData);
    if (result.success) {
      navigate('/user-home');
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <Header isLogged={false} />
      <main className="form-page">
        <div className="form-container">
          <h2>Регистрация</h2>
          {error && <div className="error-message">{error}</div>}
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

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Введите email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />

            <button type="submit" className="btn">Создать аккаунт</button>
          </form>
          <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
      </main>
    </>
  );
};

export default Register;
