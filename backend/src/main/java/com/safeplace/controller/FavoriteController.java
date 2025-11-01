package com.safeplace.controller;

import com.safeplace.entity.Favorite;
import com.safeplace.security.CurrentUser;
import com.safeplace.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<Favorite> addFavorite(@RequestBody Map<String, Object> request) {
        Long userId = currentUser.getId();
        String articleCategory = (String) request.get("articleCategory");
        Integer articleId = (Integer) request.get("articleId");
        Favorite favorite = favoriteService.addFavorite(userId, articleCategory, articleId);
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFavorite(@RequestParam String articleCategory,
                                               @RequestParam Integer articleId) {
        Long userId = currentUser.getId();
        favoriteService.removeFavorite(userId, articleCategory, articleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> getUserFavorites() {
        Long userId = currentUser.getId();
        List<Favorite> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@RequestParam String articleCategory,
                                                              @RequestParam Integer articleId) {
        Long userId = currentUser.getId();
        boolean isFavorite = favoriteService.isFavorite(userId, articleCategory, articleId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
}
