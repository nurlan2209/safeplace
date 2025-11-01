# SafePlace - Платформа поддержки

SafePlace — это безопасное пространство для женщин, где можно получить поддержку, поделиться историями и найти помощь в сложных ситуациях.

## Технологии

### Frontend
- React 18
- React Router v6
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB
- JWT для аутентификации
- bcryptjs для хеширования паролей

## Функционал

- ✅ Регистрация и авторизация пользователей
- ✅ Форум с категориями (Здоровье, Отношения, Поддержка, Истории)
- ✅ Создание постов (в т.ч. анонимно)
- ✅ Комментарии к постам
- ✅ Система личных сообщений (чаты)
- ✅ Избранные статьи
- ✅ Редактирование профиля
- ✅ Изменение пароля
- ✅ Ресурсы помощи (горячие линии, психологи)

## Установка и запуск

### Требования
- Node.js (v14+)
- MongoDB

### 1. Клонирование репозитория
\`\`\`bash
git clone <repository-url>
cd safeplace
\`\`\`

### 2. Установка Backend

\`\`\`bash
cd server
npm install
\`\`\`

Создайте файл `.env` в папке `server/`:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safeplace
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
\`\`\`

Запуск сервера:
\`\`\`bash
npm start
# или для разработки с hot reload:
npm run dev
\`\`\`

### 3. Установка Frontend

\`\`\`bash
cd client
npm install
\`\`\`

Запуск клиента:
\`\`\`bash
npm start
\`\`\`

Приложение откроется на `http://localhost:3000`

## Структура проекта

\`\`\`
safeplace/
├── client/                 # React приложение
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Изображения и CSS
│   │   ├── components/    # React компоненты
│   │   ├── contexts/      # Context API (AuthContext)
│   │   ├── pages/         # Страницы приложения
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── server/                # Node.js Backend
    ├── src/
    │   ├── config/        # Конфигурация (база данных)
    │   ├── controllers/   # Контроллеры
    │   ├── models/        # Mongoose модели
    │   ├── routes/        # API маршруты
    │   ├── middleware/    # Middleware (auth)
    │   └── server.js      # Точка входа
    └── package.json
\`\`\`

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя
- `PUT /api/auth/profile` - Обновить профиль
- `PUT /api/auth/change-password` - Изменить пароль

### Посты (Форум)
- `GET /api/posts` - Получить все посты
- `GET /api/posts?category=Здоровье` - Получить посты по категории
- `GET /api/posts/:id` - Получить один пост
- `POST /api/posts` - Создать пост
- `POST /api/posts/:id/comments` - Добавить комментарий
- `DELETE /api/posts/:id` - Удалить пост

### Сообщения
- `GET /api/messages/chats` - Получить все чаты
- `GET /api/messages/:chatId` - Получить сообщения чата
- `POST /api/messages/chats` - Создать чат
- `POST /api/messages` - Отправить сообщение

### Избранное
- `GET /api/favorites` - Получить избранные статьи
- `POST /api/favorites` - Добавить в избранное
- `DELETE /api/favorites/:id` - Удалить из избранного

## Лицензия

MIT
