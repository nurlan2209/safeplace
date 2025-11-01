const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Регистрация пользователя
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов')
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Вход пользователя
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Получить текущего пользователя
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   PUT /api/auth/profile
// @desc    Обновить профиль
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Изменить пароль
// @access  Private
router.put('/change-password', auth, authController.changePassword);

module.exports = router;
