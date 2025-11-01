import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/messages.css';

const Messages = () => {
  const [chats, setChats] = useState([
    { id: 1, name: 'Анонимный чат', active: true },
    { id: 2, name: 'Анна', active: false },
    { id: 3, name: 'Лейла', active: false },
    { id: 4, name: 'Алия', active: false }
  ]);
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Привет 🌷 Как дела сегодня?', sent: false },
    { id: 2, text: 'Привет, всё нормально 💕 спасибо', sent: true }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleChatChange = (chat) => {
    setActiveChat(chat);
    // Здесь будет загрузка сообщений для выбранного чата
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sent: true
      }]);
      setNewMessage('');
    }
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="messages-page">
        <h1>💬 Сообщения</h1>

        <div className="chat-container">
          <aside className="chat-list">
            <h2>Мои чаты</h2>
            <ul>
              {chats.map(chat => (
                <li
                  key={chat.id}
                  className={`chat-user ${activeChat.id === chat.id ? 'active' : ''}`}
                  onClick={() => handleChatChange(chat)}
                >
                  {chat.name}
                </li>
              ))}
            </ul>
            <div className="back-link">
              <Link to="/user-home">← Назад</Link>
            </div>
          </aside>

          <section className="chat-box">
            <div className="chat-header">
              <h3>{activeChat.name}</h3>
            </div>

            <div className="chat-messages">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.sent ? 'sent' : 'received'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <form onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Написать сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Отправить</button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Messages;
