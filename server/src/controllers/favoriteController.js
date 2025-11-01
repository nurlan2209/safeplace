const Favorite = require('../models/Favorite');
const User = require('../models/User');

// Получить все избранные статьи пользователя
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Добавить статью в избранное
exports.addFavorite = async (req, res) => {
  try {
    const { articleCategory, articleId } = req.body;

    // Проверка, не добавлена ли уже эта статья
    const existing = await Favorite.findOne({
      user: req.user._id,
      articleCategory,
      articleId
    });

    if (existing) {
      return res.status(400).json({ message: 'Статья уже в избранном' });
    }

    const favorite = new Favorite({
      user: req.user._id,
      articleCategory,
      articleId
    });

    await favorite.save();

    // Увеличить счетчик избранного
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { favoritesCount: 1 }
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить статью из избранного
exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOne({
      _id: id,
      user: req.user._id
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Избранное не найдено' });
    }

    await favorite.deleteOne();

    // Уменьшить счетчик избранного
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { favoritesCount: -1 }
    });

    res.json({ message: 'Удалено из избранного' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
