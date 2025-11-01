const { Message, Chat } = require('../models/Message');
const User = require('../models/User');

// Получить все чаты пользователя
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить сообщения чата
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    // Проверка, что пользователь является участником чата
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Нет доступа к этому чату' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать или получить чат
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // Проверка существования пользователя
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка существования чата
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] }
    }).populate('participants', 'name email');

    if (chat) {
      return res.json(chat);
    }

    // Создание нового чата
    chat = new Chat({
      participants: [req.user._id, userId]
    });

    await chat.save();
    chat = await chat.populate('participants', 'name email');

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Отправить сообщение
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    // Проверка, что пользователь является участником чата
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Нет доступа к этому чату' });
    }

    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      text
    });

    await message.save();

    // Обновить последнее сообщение в чате
    chat.lastMessage = text;
    chat.updatedAt = Date.now();
    await chat.save();

    const populatedMessage = await message.populate('sender', 'name');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
