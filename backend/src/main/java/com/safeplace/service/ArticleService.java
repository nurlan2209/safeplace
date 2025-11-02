package com.safeplace.service;

import com.safeplace.dto.ArticleRequest;
import com.safeplace.entity.Article;
import com.safeplace.entity.Role;
import com.safeplace.entity.User;
import com.safeplace.repository.ArticleRepository;
import com.safeplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Article createArticle(Long authorId, ArticleRequest request) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (author.getRole() != Role.ADMIN) {
            throw new RuntimeException("Только администраторы могут создавать статьи");
        }

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCategory(request.getCategory());
        article.setImageUrl(request.getImageUrl());
        article.setAuthor(author);
        article.setViewsCount(0);

        return articleRepository.save(article);
    }

    public List<Article> getAllArticles() {
        return articleRepository.findByOrderByCreatedAtDesc();
    }

    public List<Article> getArticlesByCategory(String category) {
        return articleRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public Article getArticleById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));

        // Увеличиваем счетчик просмотров
        article.setViewsCount(article.getViewsCount() + 1);
        articleRepository.save(article);

        return article;
    }

    @Transactional
    public Article updateArticle(Long authorId, Long articleId, ArticleRequest request) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (author.getRole() != Role.ADMIN) {
            throw new RuntimeException("Только администраторы могут редактировать статьи");
        }

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));

        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCategory(request.getCategory());
        article.setImageUrl(request.getImageUrl());

        return articleRepository.save(article);
    }

    @Transactional
    public void deleteArticle(Long authorId, Long articleId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (author.getRole() != Role.ADMIN) {
            throw new RuntimeException("Только администраторы могут удалять статьи");
        }

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));

        articleRepository.delete(article);
    }
}
