package com.safeplace.controller;

import com.safeplace.dto.ArticleRequest;
import com.safeplace.entity.Article;
import com.safeplace.security.CurrentUser;
import com.safeplace.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<Article> createArticle(@Valid @RequestBody ArticleRequest request) {
        Long userId = currentUser.getId();
        Article article = articleService.createArticle(userId, request);
        return ResponseEntity.ok(article);
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles(@RequestParam(required = false) String category) {
        List<Article> articles = category != null
                ? articleService.getArticlesByCategory(category)
                : articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id,
                                                 @Valid @RequestBody ArticleRequest request) {
        Long userId = currentUser.getId();
        Article article = articleService.updateArticle(userId, id, request);
        return ResponseEntity.ok(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        Long userId = currentUser.getId();
        articleService.deleteArticle(userId, id);
        return ResponseEntity.noContent().build();
    }
}
