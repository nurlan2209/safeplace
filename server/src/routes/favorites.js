const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

// @route   GET /api/favorites
// @desc    Получить все избранные статьи
// @access  Private
router.get('/', auth, favoriteController.getFavorites);

// @route   POST /api/favorites
// @desc    Добавить статью в избранное
// @access  Private
router.post('/', auth, favoriteController.addFavorite);

// @route   DELETE /api/favorites/:id
// @desc    Удалить статью из избранного
// @access  Private
router.delete('/:id', auth, favoriteController.removeFavorite);

module.exports = router;
