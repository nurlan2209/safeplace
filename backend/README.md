# SafePlace Backend API

SafePlace - платформа поддержки для женщин. Backend на Java Spring Boot с SQLite базой данных.

## Технологии

- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- SQLite
- Maven

## Запуск

### Требования
- Java 17+
- Maven 3.6+

### Локальный запуск

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API будет доступен на `http://localhost:5000`

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя
- `PUT /api/auth/profile` - Обновить профиль
- `POST /api/auth/change-password` - Изменить пароль

### Посты
- `GET /api/posts` - Получить все посты
- `GET /api/posts?category=Здоровье` - Посты по категории
- `GET /api/posts/{id}` - Получить пост
- `POST /api/posts` - Создать пост
- `POST /api/posts/{id}/comments` - Добавить комментарий
- `DELETE /api/posts/{id}` - Удалить пост

### Сообщения
- `GET /api/messages/chats` - Получить чаты пользователя
- `POST /api/messages/chats` - Создать/получить чат
- `GET /api/messages/chats/{id}/messages` - Получить сообщения чата
- `POST /api/messages/chats/{id}/messages` - Отправить сообщение

### Избранное
- `GET /api/favorites` - Получить избранное
- `POST /api/favorites` - Добавить в избранное
- `DELETE /api/favorites` - Удалить из избранного
- `GET /api/favorites/check` - Проверить наличие в избранном

## База данных

Используется SQLite. База данных создается автоматически при первом запуске в файле `safeplace.db`.

## Безопасность

Все эндпоинты (кроме регистрации и входа) защищены JWT токенами.

Токен должен быть передан в заголовке:
```
Authorization: Bearer <token>
```
