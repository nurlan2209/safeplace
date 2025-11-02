import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { messagesAPI } from '../utils/api';
import '../assets/css/messages.css';

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      const data = await messagesAPI.getChats();
      setChats(data);
      if (data.length > 0) {
        setActiveChat(data[0]);
        loadMessages(data[0].id);
      }
    } catch (err) {
      setError('Ошибка загрузки чатов: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const data = await messagesAPI.getChatMessages(chatId);
      setMessages(data);
    } catch (err) {
      setError('Ошибка загрузки сообщений: ' + err.message);
    }
  };

  const handleChatChange = (chat) => {
    setActiveChat(chat);
    loadMessages(chat.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await messagesAPI.sendMessage(activeChat.id, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      setError('Ошибка отправки сообщения: ' + err.message);
    }
  };

  const getOtherParticipantName = (chat) => {
    if (!chat || !chat.participants) return 'Чат';
    const currentUserId = parseInt(localStorage.getItem('userId'));
    const otherUser = chat.participants.find(p => p.id !== currentUserId);
    return otherUser ? otherUser.name : 'Анонимный чат';
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="messages-page">
        <h1>💬 Сообщения</h1>

        {error && <div style={{color: '#d9534f', marginBottom: '10px'}}>{error}</div>}

        {loading ? (
          <p>Загрузка чатов...</p>
        ) : (
          <div className="chat-container">
            <aside className="chat-list">
              <h2>Мои чаты</h2>
              <ul>
                {chats.length === 0 ? (
                  <li style={{padding: '10px', color: '#999'}}>Нет активных чатов</li>
                ) : (
                  chats.map(chat => (
                    <li
                      key={chat.id}
                      className={`chat-user ${activeChat && activeChat.id === chat.id ? 'active' : ''}`}
                      onClick={() => handleChatChange(chat)}
                    >
                      {getOtherParticipantName(chat)}
                    </li>
                  ))
                )}
              </ul>
              <div className="back-link">
                <Link to="/user-home">← Назад</Link>
              </div>
            </aside>

            <section className="chat-box">
              {activeChat ? (
                <>
                  <div className="chat-header">
                    <h3>{getOtherParticipantName(activeChat)}</h3>
                  </div>

                  <div className="chat-messages">
                    {messages.length === 0 ? (
                      <p style={{textAlign: 'center', color: '#999', marginTop: '20px'}}>
                        Начните разговор!
                      </p>
                    ) : (
                      messages.map(message => {
                        const currentUserId = parseInt(localStorage.getItem('userId'));
                        const isSent = message.sender && message.sender.id === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`message ${isSent ? 'sent' : 'received'}`}
                          >
                            {message.text}
                          </div>
                        );
                      })
                    )}
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
                </>
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999'}}>
                  Выберите чат для начала общения
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
};

export default Messages;
