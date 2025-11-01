package com.safeplace.service;

import com.safeplace.dto.CommentRequest;
import com.safeplace.dto.PostRequest;
import com.safeplace.entity.Comment;
import com.safeplace.entity.Post;
import com.safeplace.entity.User;
import com.safeplace.repository.CommentRepository;
import com.safeplace.repository.PostRepository;
import com.safeplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public Post createPost(Long userId, PostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());
        post.setAuthor(user);
        post.setAnonymous(request.getAnonymous() != null ? request.getAnonymous() : false);

        Post savedPost = postRepository.save(post);

        // Обновляем счетчик постов пользователя
        user.setPostsCount(user.getPostsCount() + 1);
        userRepository.save(user);

        return savedPost;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByCategory(String category) {
        return postRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));
    }

    public Comment addComment(Long userId, Long postId, CommentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(request.getText());
        comment.setAnonymous(request.getAnonymous() != null ? request.getAnonymous() : false);

        Comment savedComment = commentRepository.save(comment);

        // Обновляем счетчик комментариев пользователя
        user.setCommentsCount(user.getCommentsCount() + 1);
        userRepository.save(user);

        return savedComment;
    }

    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Нет прав на удаление этого поста");
        }

        postRepository.delete(post);

        // Уменьшаем счетчик постов пользователя
        User user = post.getAuthor();
        user.setPostsCount(Math.max(0, user.getPostsCount() - 1));
        userRepository.save(user);
    }
}
