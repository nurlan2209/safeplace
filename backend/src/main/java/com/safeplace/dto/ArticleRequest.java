package com.safeplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ArticleRequest {

    @NotBlank(message = "Заголовок обязателен")
    private String title;

    @NotBlank(message = "Контент обязателен")
    private String content;

    @NotBlank(message = "Категория обязательна")
    private String category;

    private String imageUrl;
}
