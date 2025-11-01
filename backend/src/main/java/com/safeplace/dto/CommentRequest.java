package com.safeplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {

    @NotBlank(message = "Текст комментария обязателен")
    private String text;

    private Boolean anonymous = false;
}
