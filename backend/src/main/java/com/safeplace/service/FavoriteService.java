package com.safeplace.service;

import com.safeplace.entity.Favorite;
import com.safeplace.entity.User;
import com.safeplace.repository.FavoriteRepository;
import com.safeplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    public Favorite addFavorite(Long userId, String articleCategory, Integer articleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (favoriteRepository.existsByUserIdAndArticleCategoryAndArticleId(userId, articleCategory, articleId)) {
            throw new RuntimeException("Статья уже добавлена в избранное");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setArticleCategory(articleCategory);
        favorite.setArticleId(articleId);

        Favorite savedFavorite = favoriteRepository.save(favorite);

        // Обновляем счетчик избранного пользователя
        user.setFavoritesCount(user.getFavoritesCount() + 1);
        userRepository.save(user);

        return savedFavorite;
    }

    public void removeFavorite(Long userId, String articleCategory, Integer articleId) {
        if (!favoriteRepository.existsByUserIdAndArticleCategoryAndArticleId(userId, articleCategory, articleId)) {
            throw new RuntimeException("Статья не найдена в избранном");
        }

        favoriteRepository.deleteByUserIdAndArticleCategoryAndArticleId(userId, articleCategory, articleId);

        // Уменьшаем счетчик избранного пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        user.setFavoritesCount(Math.max(0, user.getFavoritesCount() - 1));
        userRepository.save(user);
    }

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorite(Long userId, String articleCategory, Integer articleId) {
        return favoriteRepository.existsByUserIdAndArticleCategoryAndArticleId(userId, articleCategory, articleId);
    }
}
