package com.safeplace.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final HttpClient httpClient;
    private final Gson gson;

    public GeminiService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.gson = new Gson();
    }

    /**
     * Генерирует ответ от Gemini AI на основе сообщения пользователя
     *
     * @param userMessage сообщение пользователя
     * @return ответ от AI
     */
    public String generateResponse(String userMessage) {
    try {
        String systemPrompt = "Ты - Айала, эмпатичный AI психолог-консультант платформы SafePlace для женщин. " +
                "Твоя цель - оказывать психологическую поддержку, помогать справляться с тревожностью, стрессом, " +
                "низкой самооценкой, проблемами в отношениях, самопринятием.\n\n" +
                "ПРАВИЛА:\n" +
                "1. Пиши тепло, по-дружески, на 'ты'\n" +
                "2. Проявляй эмпатию\n" +
                "3. Задавай уточняющие вопросы\n" +
                "4. Давай практические советы\n" +
                "5. Отвечай кратко: 3-5 предложений\n" +
                "6. НЕ повторяйся, давай РАЗНЫЕ ответы на разные сообщения\n" +
                "7. Реагируй на КОНКРЕТНОЕ сообщение пользователя\n" +
                "8. При серьезных проблемах рекомендуй специалиста\n\n" +
                "Отвечай на русском.";

        String fullPrompt = systemPrompt + "\n\nСообщение: " + userMessage;

            // Создаем JSON запрос для Gemini API
            JsonObject requestBody = createRequestBody(fullPrompt);
            String jsonRequest = gson.toJson(requestBody);

            logger.debug("Sending request to Gemini API");

            // Отправляем запрос к API
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                logger.debug("Received successful response from Gemini API");
                return parseResponse(response.body());
            } else {
                logger.error("Gemini API error: {} - {}", response.statusCode(), response.body());
                return getFallbackResponse();
            }

        } catch (IOException | InterruptedException e) {
            logger.error("Error calling Gemini API", e);
            Thread.currentThread().interrupt();
            return getFallbackResponse();
        } catch (Exception e) {
            logger.error("Unexpected error in Gemini service", e);
            return getFallbackResponse();
        }
    }

    /**
     * Создает тело запроса для Gemini API
     */
    private JsonObject createRequestBody(String prompt) {
        JsonObject requestBody = new JsonObject();

        JsonArray contents = new JsonArray();
        JsonObject content = new JsonObject();

        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);
        parts.add(part);

        content.add("parts", parts);
        contents.add(content);

        requestBody.add("contents", contents);

        // Добавляем параметры генерации
        JsonObject generationConfig = new JsonObject();
        generationConfig.addProperty("temperature", 0.7);
        generationConfig.addProperty("topK", 40);
        generationConfig.addProperty("topP", 0.95);
        generationConfig.addProperty("maxOutputTokens", 1024);
        requestBody.add("generationConfig", generationConfig);

        return requestBody;
    }

    /**
     * Парсит ответ от Gemini API
     */
    private String parseResponse(String responseBody) {
        try {
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            if (jsonResponse.has("candidates")) {
                JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
                if (candidates.size() > 0) {
                    JsonObject candidate = candidates.get(0).getAsJsonObject();
                    JsonObject content = candidate.getAsJsonObject("content");
                    JsonArray parts = content.getAsJsonArray("parts");
                    if (parts.size() > 0) {
                        JsonObject part = parts.get(0).getAsJsonObject();
                        return part.get("text").getAsString().trim();
                    }
                }
            }

            logger.warn("Could not parse Gemini response, using fallback");
            return getFallbackResponse();

        } catch (Exception e) {
            logger.error("Error parsing Gemini response", e);
            return getFallbackResponse();
        }
    }

    /**
     * Возвращает резервный ответ в случае ошибки API
     */
    private String getFallbackResponse() {
        return "Спасибо за твое сообщение. Я здесь, чтобы поддержать тебя. " +
               "Расскажи мне подробнее о том, что тебя беспокоит, и я постараюсь помочь.";
    }
}
