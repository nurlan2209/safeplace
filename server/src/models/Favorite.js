const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  articleCategory: {
    type: String,
    required: true
  },
  articleId: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Один пользователь не может добавить одну и ту же статью дважды
FavoriteSchema.index({ user: 1, articleCategory: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
