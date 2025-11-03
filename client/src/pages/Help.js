import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { messagesAPI } from "../utils/api";
import "../assets/css/help.css";
import ayala from "../assets/images/ayala.png";

const Help = () => {
  const navigate = useNavigate();

  const handleContactAyala = async () => {
    try {
      // Create or get Ayala chat when user clicks the button
      await messagesAPI.getOrCreateAyalaChat();
      // Navigate to messages page
      navigate("/messages");
    } catch (err) {
      console.error("Error creating Ayala chat:", err);
      alert("Ошибка при создании чата с Ayala");
    }
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="help-container">
        <h1>💗 Помощь и Поддержка</h1>
        <p className="help-subtitle">
          Ты не один. Здесь собраны проверенные службы доверия и специалисты,
          готовые выслушать и поддержать тебя.
        </p>

        <section className="help-section">
          <h2>📞 Горячие линии Казахстана</h2>
          <div className="help-cards">
            <div className="help-card">
              <h3>Единая служба доверия 111</h3>
              <p>
                <strong>111</strong> — круглосуточно, анонимно, бесплатно
              </p>
              <p>Помощь жертвам бытового насилия и буллинга.</p>
            </div>
            <div className="help-card">
              <h3>Телефон доверия 150</h3>
              <p>
                <strong>150</strong> — Центр поддержки пострадавших от насилия
              </p>
              <p>Эмоциональная и психологическая помощь.</p>
            </div>
            <div className="help-card">
              <h3>Телефон доверия 1303</h3>
              <p>
                <strong>1303</strong> — Любые обращения анонимны
              </p>
              <p>
                Бесплатная консультация по вопросам тревожности и депрессии.
              </p>
            </div>
          </div>
        </section>

        <section className="help-section psychologist-section">
          <h2>👩‍⚕️ Психолог SafePlace</h2>
          <div className="psychologist-card">
            <img src={ayala} alt="Ayala" className="psychologist-photo" />
            <div className="psychologist-info">
              <h3>Ayala</h3>
              <p className="title">Психолог-консультант</p>
              <p>
                Помощь при тревожности, низкой самооценке, сложностях в
                отношениях и самопринятии.
              </p>
              <button onClick={handleContactAyala} className="btn-main">
                Написать
              </button>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>🌍 Международные ресурсы</h2>
          <div className="help-cards">
            <div className="help-card">
              <h3>Janym</h3>
              <p>
                <a
                  href="https://janym.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  janym.org
                </a>
              </p>
              <p>Твой личный онлайн-психолог.</p>
            </div>
            <div className="help-card">
              <h3>Befrienders Worldwide</h3>
              <p>
                <a
                  href="https://www.befrienders.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  befrienders.org
                </a>
              </p>
              <p>Международная сеть поддержки при кризисах и депрессии.</p>
            </div>
          </div>
        </section>

        <div className="back-link">
          <Link to="/user-home">← Назад</Link>
        </div>
      </main>
    </>
  );
};

export default Help;
