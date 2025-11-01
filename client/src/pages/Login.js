import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
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

    const result = await login(formData.email, formData.password);
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
          <h2>Вход</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
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
            />

            <button type="submit" className="btn">Войти</button>
          </form>
          <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
      </main>
    </>
  );
};

export default Login;
