package com.safeplace.dto;

import com.safeplace.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String avatar;
    private Integer postsCount;
    private Integer commentsCount;
    private Integer favoritesCount;

    public static UserDto fromUser(User user) {
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getBio(),
            user.getAvatar(),
            user.getPostsCount(),
            user.getCommentsCount(),
            user.getFavoritesCount()
        );
    }
}
