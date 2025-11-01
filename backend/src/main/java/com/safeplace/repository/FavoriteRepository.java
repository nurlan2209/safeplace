package com.safeplace.repository;

import com.safeplace.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndArticleCategoryAndArticleId(Long userId, String articleCategory, Integer articleId);
    boolean existsByUserIdAndArticleCategoryAndArticleId(Long userId, String articleCategory, Integer articleId);
    void deleteByUserIdAndArticleCategoryAndArticleId(Long userId, String articleCategory, Integer articleId);
}
