import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { messagesAPI } from "../utils/api";
import "../assets/css/messages.css";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  useEffect(() => {
    loadChats();
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (activeChat) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [activeChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const startPolling = () => {
    stopPolling();
    pollingInterval.current = setInterval(() => {
      if (activeChat && !isTyping) {
        loadMessages(activeChat.id, true);
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

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
      setError("Ошибка загрузки чатов: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId, silent = false) => {
    try {
      const data = await messagesAPI.getChatMessages(chatId);
      const prevLength = messages.length;
      setMessages(data);

      if (data.length > prevLength && data[data.length - 1]?.isAiMessage) {
        setIsTyping(false);
      }
    } catch (err) {
      if (!silent) setError("Ошибка загрузки сообщений: " + err.message);
    }
  };

  const handleChatChange = (chat) => {
    setActiveChat(chat);
    setIsTyping(false);
    loadMessages(chat.id);
  };

  const handleCreateNewChat = async () => {
    setIsCreatingChat(true);
    try {
      const newChat = await messagesAPI.getOrCreateAyalaChat();
      await loadChats();
      setActiveChat(newChat);
      loadMessages(newChat.id);
    } catch (err) {
      setError("Ошибка создания чата: " + err.message);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const tempMessage = newMessage;
    setNewMessage("");

    try {
      const message = await messagesAPI.sendMessage(activeChat.id, tempMessage);
      setMessages((prev) => [...prev, message]);

      if (activeChat.isAiChat) {
        setIsTyping(true);
      }

      await loadChats();
    } catch (err) {
      setError("Ошибка отправки сообщения: " + err.message);
      setNewMessage(tempMessage);
    }
  };

  const getChatTitle = (chat) => {
    if (!chat) return "Чат";
    if (chat.chatName) return chat.chatName;
    const date = new Date(chat.updatedAt);
    return `Чат от ${date.toLocaleDateString("ru-RU")}`;
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="messages-page">
        <h1>💬 Сообщения</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Загрузка чатов...</p>
        ) : (
          <div className="chat-container">
            <aside className="chat-list">
              <div className="chat-list-header">
                <h2>Мои чаты</h2>
                <button
                  onClick={handleCreateNewChat}
                  className="new-chat-btn"
                  disabled={isCreatingChat}
                >
                  + Новый чат
                </button>
              </div>
              <ul>
                {chats.length === 0 ? (
                  <li className="empty-state">Нет активных чатов</li>
                ) : (
                  chats.map((chat) => (
                    <li
                      key={chat.id}
                      className={`chat-item ${
                        activeChat?.id === chat.id ? "active" : ""
                      }`}
                      onClick={() => handleChatChange(chat)}
                    >
                      <div className="chat-item-title">
                        {getChatTitle(chat)}
                      </div>
                      {chat.lastMessage && (
                        <div className="chat-item-preview">
                          {chat.lastMessage.substring(0, 50)}...
                        </div>
                      )}
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
                    <h3>{getChatTitle(activeChat)}</h3>
                  </div>

                  <div className="chat-messages">
                    {messages.length === 0 ? (
                      <p className="empty-messages">Начните разговор!</p>
                    ) : (
                      messages.map((message) => {
                        const isSent = !message.isAiMessage;
                        return (
                          <div
                            key={message.id}
                            className={`message ${
                              isSent ? "sent" : "received"
                            }`}
                          >
                            {message.text}
                          </div>
                        );
                      })
                    )}
                    {isTyping && (
                      <div className="message received typing">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
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
                <div className="empty-chat">
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
