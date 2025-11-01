package com.safeplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {

    @NotBlank(message = "Заголовок обязателен")
    private String title;

    @NotBlank(message = "Содержание обязательно")
    private String content;

    @NotBlank(message = "Категория обязательна")
    private String category;

    private Boolean anonymous = false;
}
