const API_URL = "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Posts API
export const postsAPI = {
  getAll: async (category = null) => {
    const url = category
      ? `${API_URL}/posts?category=${category}`
      : `${API_URL}/posts`;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
  },

  create: async (postData) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  },

  addComment: async (postId, commentData) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to delete post");
  },
};

// Articles API
export const articlesAPI = {
  getAll: async (category = null) => {
    const url = category
      ? `${API_URL}/articles?category=${category}`
      : `${API_URL}/articles`;
    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch articles");
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch article");
    return response.json();
  },

  create: async (articleData) => {
    const response = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(articleData),
    });
    if (!response.ok) throw new Error("Failed to create article");
    return response.json();
  },

  update: async (id, articleData) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(articleData),
    });
    if (!response.ok) throw new Error("Failed to update article");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to delete article");
  },
};

// Messages API
export const messagesAPI = {
  getChats: async () => {
    const response = await fetch(`${API_URL}/messages/chats`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch chats");
    return response.json();
  },

  getOrCreateChat: async (userId) => {
    const response = await fetch(`${API_URL}/messages/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error("Failed to get or create chat");
    return response.json();
  },

  getChatMessages: async (chatId) => {
    const response = await fetch(
      `${API_URL}/messages/chats/${chatId}/messages`,
      {
        headers: getAuthHeader(),
      }
    );
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
  },

  sendMessage: async (chatId, text) => {
    const response = await fetch(
      `${API_URL}/messages/chats/${chatId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ text }),
      }
    );
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  },

  getOrCreateAyalaChat: async () => {
    const response = await fetch(`${API_URL}/messages/chats/ayala`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (!response.ok) throw new Error("Failed to create Ayala chat");
    return response.json();
  },
  deleteChat: async (chatId) => {
    const response = await fetch(`${API_URL}/messages/chats/${chatId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to delete chat");
  },
};

// Favorites API
export const favoritesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/favorites`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch favorites");
    return response.json();
  },

  add: async (articleCategory, articleId) => {
    const response = await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ articleCategory, articleId }),
    });
    if (!response.ok) throw new Error("Failed to add favorite");
    return response.json();
  },

  remove: async (articleCategory, articleId) => {
    const response = await fetch(
      `${API_URL}/favorites?articleCategory=${articleCategory}&articleId=${articleId}`,
      {
        method: "DELETE",
        headers: getAuthHeader(),
      }
    );
    if (!response.ok) throw new Error("Failed to remove favorite");
  },

  check: async (articleCategory, articleId) => {
    const response = await fetch(
      `${API_URL}/favorites/check?articleCategory=${articleCategory}&articleId=${articleId}`,
      {
        headers: getAuthHeader(),
      }
    );
    if (!response.ok) throw new Error("Failed to check favorite");
    return response.json();
  },
};
