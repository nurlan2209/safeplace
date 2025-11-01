# SafePlace - Платформа поддержки

SafePlace — это безопасное пространство для женщин, где можно получить поддержку, поделиться историями и найти помощь в сложных ситуациях.

## Технологии

### Frontend
- React 18
- React Router v6
- Axios
- CSS3

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- SQLite
- Maven

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
- Docker и Docker Compose (рекомендуется)

ИЛИ для локального запуска:
- Java 17+
- Maven 3.6+
- Node.js 18+

### 1. Клонирование репозитория
\`\`\`bash
git clone <repository-url>
cd safeplace
\`\`\`

### 2. Запуск с Docker (рекомендуется)

Самый простой способ запустить проект:

\`\`\`bash
docker-compose up --build
\`\`\`

Приложение будет доступно:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`

### 3. Локальный запуск

#### Backend
\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

Backend запустится на `http://localhost:5000`

#### Frontend
\`\`\`bash
cd client
npm install
npm start
\`\`\`

Frontend откроется на `http://localhost:3000`

## Структура проекта

\`\`\`
safeplace/
├── client/                           # React приложение
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Изображения и CSS
│   │   ├── components/              # React компоненты
│   │   ├── contexts/                # Context API (AuthContext)
│   │   ├── pages/                   # Страницы приложения
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
├── backend/                          # Java Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/safeplace/
│   │       │   ├── config/          # Конфигурация (Security, CORS)
│   │       │   ├── controller/      # REST контроллеры
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── entity/          # JPA Entity классы
│   │       │   ├── repository/      # Spring Data repositories
│   │       │   ├── security/        # JWT, Security
│   │       │   ├── service/         # Бизнес-логика
│   │       │   └── SafePlaceApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── docker-compose.yml                # Docker Compose конфигурация
└── README.md
\`\`\`

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя
- `PUT /api/auth/profile` - Обновить профиль
- `POST /api/auth/change-password` - Изменить пароль

### Посты (Форум)
- `GET /api/posts` - Получить все посты
- `GET /api/posts?category=Здоровье` - Получить посты по категории
- `GET /api/posts/{id}` - Получить один пост
- `POST /api/posts` - Создать пост
- `POST /api/posts/{id}/comments` - Добавить комментарий
- `DELETE /api/posts/{id}` - Удалить пост

### Сообщения
- `GET /api/messages/chats` - Получить все чаты
- `POST /api/messages/chats` - Создать/получить чат
- `GET /api/messages/chats/{chatId}/messages` - Получить сообщения чата
- `POST /api/messages/chats/{chatId}/messages` - Отправить сообщение

### Избранное
- `GET /api/favorites` - Получить избранные статьи
- `POST /api/favorites` - Добавить в избранное
- `DELETE /api/favorites` - Удалить из избранного
- `GET /api/favorites/check` - Проверить наличие в избранном

## База данных

Проект использует SQLite - легковесную встроенную базу данных, которая не требует отдельного сервера. База данных создается автоматически при первом запуске.

## Безопасность

- Все пароли хешируются с использованием BCrypt
- JWT токены для аутентификации
- CORS настроен для безопасного взаимодействия frontend и backend
- Валидация данных на стороне сервера

## Docker

Проект полностью контейнизирован и может быть запущен одной командой:

\`\`\`bash
docker-compose up --build
\`\`\`

Это запустит:
- Backend на порту 5000
- Frontend на порту 80
- SQLite база данных будет сохранена в Docker volume

## Лицензия

MIT
