// client/src/pages/Favorites.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { favoritesAPI, postsAPI } from "../utils/api";
import "../assets/css/favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError("");
    try {
      const favData = await favoritesAPI.getAll();
      const detailedFavorites = await Promise.all(
        favData.map(async (fav) => {
          try {
            if (fav.articleCategory === "post") {
              const post = await postsAPI.getById(fav.articleId);
              return {
                ...fav,
                title: post.title,
                description: post.content.substring(0, 150) + "...",
                postData: post,
              };
            }
            return null;
          } catch (err) {
            return null;
          }
        })
      );
      setFavorites(detailedFavorites.filter((f) => f !== null));
    } catch (err) {
      setError("Ошибка загрузки избранного: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleCategory, articleId) => {
    try {
      await favoritesAPI.remove(articleCategory, articleId);
      setFavorites(
        favorites.filter(
          (item) =>
            !(
              item.articleCategory === articleCategory &&
              item.articleId === articleId
            )
        )
      );
    } catch (err) {
      setError("Ошибка удаления из избранного: " + err.message);
    }
  };

  const handlePostClick = (postData) => {
    setSelectedPost(postData);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await postsAPI.addComment(selectedPost.id, {
        text: commentText,
        anonymous: commentAnonymous,
      });
      setCommentText("");
      setCommentAnonymous(false);
      const updatedPost = await postsAPI.getById(selectedPost.id);
      setSelectedPost(updatedPost);
    } catch (err) {
      setError("Ошибка добавления комментария: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <>
      <Header isLogged={true} />
      <header className="header">
        <h1>💖 Мои сохранённые</h1>
      </header>

      <main className="favorites-page">
        <div className="back-link">
          <Link to="/user-home">← Назад на главную</Link>
        </div>

        {error && (
          <div style={{ color: "#d9534f", marginBottom: "10px" }}>{error}</div>
        )}

        {loading ? (
          <p>Загрузка избранного...</p>
        ) : (
          <div className="favorites-grid">
            {favorites.length === 0 ? (
              <p>У вас пока нет сохраненных постов</p>
            ) : (
              favorites.map((item) => (
                <div
                  key={`${item.articleCategory}-${item.articleId}`}
                  className="favorite-card"
                >
                  <div className="content">
                    <h2>{item.title || "Пост"}</h2>
                    <p>{item.description || "Описание недоступно"}</p>
                    <div className="buttons">
                      <button
                        className="read"
                        onClick={() => handlePostClick(item.postData)}
                      >
                        Читать →
                      </button>
                      <button
                        className="delete"
                        onClick={() =>
                          handleDelete(item.articleCategory, item.articleId)
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedPost && (
          <div
            className="modal"
            style={{ display: "flex" }}
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "800px", maxHeight: "80vh", overflow: "auto" }}
            >
              <span className="close" onClick={() => setSelectedPost(null)}>
                &times;
              </span>
              <h2>{selectedPost.title}</h2>
              <div style={{ marginBottom: "20px", color: "#999" }}>
                <span style={{ marginRight: "15px" }}>
                  Автор:{" "}
                  {selectedPost.anonymous
                    ? "Анонимно"
                    : selectedPost.author?.name || "Пользователь"}
                </span>
                <span>Дата: {formatDate(selectedPost.createdAt)}</span>
              </div>
              <div
                style={{
                  marginBottom: "30px",
                  whiteSpace: "pre-wrap",
                  color: "#333",
                }}
              >
                {selectedPost.content}
              </div>

              <h3>Комментарии ({selectedPost.comments?.length || 0})</h3>
              <div style={{ marginBottom: "20px" }}>
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "10px 0",
                      }}
                    >
                      <div style={{ fontWeight: "bold", color: "#E89BA1" }}>
                        {comment.anonymous
                          ? "Анонимно"
                          : comment.user?.name || "Пользователь"}
                      </div>
                      <div style={{ margin: "5px 0", color: "#333" }}>
                        {comment.text}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#999" }}>Пока нет комментариев</p>
                )}
              </div>

              <h4>Добавить комментарий</h4>
              <form onSubmit={handleAddComment}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows="3"
                  placeholder="Ваш комментарий"
                  required
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
                <label style={{ display: "block", marginBottom: "10px" }}>
                  <input
                    type="checkbox"
                    checked={commentAnonymous}
                    onChange={(e) => setCommentAnonymous(e.target.checked)}
                    style={{ marginRight: "5px" }}
                  />
                  Комментировать анонимно
                </label>
                <button type="submit" className="btn">
                  Отправить
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Favorites;
