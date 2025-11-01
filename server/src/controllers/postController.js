const Post = require('../models/Post');
const User = require('../models/User');

// Получить все посты или посты по категории
exports.getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // Скрыть имя автора, если пост анонимный
    const postsWithAnonymity = posts.map(post => ({
      ...post.toObject(),
      author: post.anonymous ? { name: 'Анонимно' } : post.author
    }));

    res.json(postsWithAnonymity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить один пост
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Скрыть имена для анонимных постов и комментариев
    const postObj = post.toObject();
    if (postObj.anonymous) {
      postObj.author = { name: 'Анонимно' };
    }

    postObj.comments = postObj.comments.map(comment => ({
      ...comment,
      user: comment.anonymous ? { name: 'Анонимно' } : comment.user
    }));

    res.json(postObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать пост
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, anonymous } = req.body;

    const post = new Post({
      title,
      content,
      category,
      author: req.user._id,
      anonymous: anonymous || false
    });

    await post.save();

    // Увеличить счетчик постов пользователя
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { postsCount: 1 }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Добавить комментарий
exports.addComment = async (req, res) => {
  try {
    const { text, anonymous } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    post.comments.push({
      user: req.user._id,
      text,
      anonymous: anonymous || false
    });

    await post.save();

    // Увеличить счетчик комментариев пользователя
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { commentsCount: 1 }
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить пост
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Проверка, что пользователь является автором
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав для удаления' });
    }

    await post.deleteOne();

    // Уменьшить счетчик постов пользователя
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { postsCount: -1 }
    });

    res.json({ message: 'Пост удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
