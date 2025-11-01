const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// @route   GET /api/messages/chats
// @desc    Получить все чаты пользователя
// @access  Private
router.get('/chats', auth, messageController.getChats);

// @route   GET /api/messages/:chatId
// @desc    Получить сообщения чата
// @access  Private
router.get('/:chatId', auth, messageController.getMessages);

// @route   POST /api/messages/chats
// @desc    Создать или получить чат
// @access  Private
router.post('/chats', auth, messageController.createChat);

// @route   POST /api/messages
// @desc    Отправить сообщение
// @access  Private
router.post('/', auth, messageController.sendMessage);

module.exports = router;
