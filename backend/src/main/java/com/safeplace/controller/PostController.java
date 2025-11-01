package com.safeplace.controller;

import com.safeplace.dto.CommentRequest;
import com.safeplace.dto.PostRequest;
import com.safeplace.entity.Comment;
import com.safeplace.entity.Post;
import com.safeplace.security.CurrentUser;
import com.safeplace.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private CurrentUser currentUser;

    @PostMapping
    public ResponseEntity<Post> createPost(@Valid @RequestBody PostRequest request) {
        Long userId = currentUser.getId();
        Post post = postService.createPost(userId, request);
        return ResponseEntity.ok(post);
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(required = false) String category) {
        List<Post> posts = category != null
                ? postService.getPostsByCategory(category)
                : postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id,
                                              @Valid @RequestBody CommentRequest request) {
        Long userId = currentUser.getId();
        Comment comment = postService.addComment(userId, id, request);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        Long userId = currentUser.getId();
        postService.deletePost(userId, id);
        return ResponseEntity.noContent().build();
    }
}
