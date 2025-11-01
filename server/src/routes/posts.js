const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Получить все посты или по категории
// @access  Private
router.get('/', auth, postController.getPosts);

// @route   GET /api/posts/:id
// @desc    Получить один пост
// @access  Private
router.get('/:id', auth, postController.getPost);

// @route   POST /api/posts
// @desc    Создать пост
// @access  Private
router.post('/', auth, postController.createPost);

// @route   POST /api/posts/:id/comments
// @desc    Добавить комментарий
// @access  Private
router.post('/:id/comments', auth, postController.addComment);

// @route   DELETE /api/posts/:id
// @desc    Удалить пост
// @access  Private
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
