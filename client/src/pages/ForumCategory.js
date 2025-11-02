import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { postsAPI } from '../utils/api';
import '../assets/css/forum-section.css';

const ForumCategory = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);

  const categoryNames = {
    health: 'Здоровье',
    relationships: 'Отношения',
    support: 'Советы и поддержка',
    stories: 'Личные истории'
  };

  const categoryIcons = {
    health: '💬',
    relationships: '💗',
    support: '🌿',
    stories: '📖'
  };

  useEffect(() => {
    loadPosts();
  }, [category]);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postsAPI.getAll(categoryNames[category]);
      setPosts(data);
    } catch (err) {
      setError('Ошибка загрузки постов: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      const post = await postsAPI.getById(postId);
      setSelectedPost(post);
    } catch (err) {
      setError('Ошибка загрузки поста: ' + err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await postsAPI.addComment(selectedPost.id, {
        text: commentText,
        anonymous: commentAnonymous
      });
      setCommentText('');
      setCommentAnonymous(false);
      handlePostClick(selectedPost.id);
    } catch (err) {
      setError('Ошибка добавления комментария: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <>
      <Header isLogged={true} />
      <main className="forum-section">
        <div className="back-link">
          <Link to="/forum">← Назад к форуму</Link>
        </div>

        <h1>{categoryIcons[category]} {categoryNames[category]}</h1>

        {error && <div style={{color: '#d9534f', marginBottom: '10px'}}>{error}</div>}

        {loading ? (
          <p>Загрузка постов...</p>
        ) : (
          <div className="posts-list">
            {posts.length === 0 ? (
              <p>Пока нет постов в этой категории.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card" onClick={() => handlePostClick(post.id)} style={{cursor: 'pointer'}}>
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span>Автор: {post.anonymous ? 'Анонимно' : post.author?.name || 'Пользователь'}</span>
                    <span>Дата: {formatDate(post.createdAt)}</span>
                    <span>Комментариев: {post.comments?.length || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedPost && (
          <div className="modal" style={{ display: 'flex' }} onClick={() => setSelectedPost(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '800px', maxHeight: '80vh', overflow: 'auto'}}>
              <span className="close" onClick={() => setSelectedPost(null)}>&times;</span>
              <h2>{selectedPost.title}</h2>
              <div style={{marginBottom: '20px', color: '#999'}}>
                <span style={{marginRight: '15px'}}>Автор: {selectedPost.anonymous ? 'Анонимно' : selectedPost.author?.name || 'Пользователь'}</span>
                <span>Дата: {formatDate(selectedPost.createdAt)}</span>
              </div>
              <div style={{marginBottom: '30px', whiteSpace: 'pre-wrap', color: '#333'}}>
                {selectedPost.content}
              </div>

              <h3>Комментарии ({selectedPost.comments?.length || 0})</h3>
              <div style={{marginBottom: '20px'}}>
                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  selectedPost.comments.map(comment => (
                    <div key={comment.id} style={{borderBottom: '1px solid #eee', padding: '10px 0'}}>
                      <div style={{fontWeight: 'bold', color: '#E89BA1'}}>
                        {comment.anonymous ? 'Анонимно' : comment.user?.name || 'Пользователь'}
                      </div>
                      <div style={{margin: '5px 0', color: '#333'}}>{comment.text}</div>
                      <div style={{fontSize: '12px', color: '#999'}}>{formatDate(comment.createdAt)}</div>
                    </div>
                  ))
                ) : (
                  <p style={{color: '#999'}}>Пока нет комментариев</p>
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
                  style={{width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
                />
                <label style={{display: 'block', marginBottom: '10px'}}>
                  <input
                    type="checkbox"
                    checked={commentAnonymous}
                    onChange={(e) => setCommentAnonymous(e.target.checked)}
                    style={{marginRight: '5px'}}
                  />
                  Комментировать анонимно
                </label>
                <button type="submit" className="btn">Отправить</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ForumCategory;
