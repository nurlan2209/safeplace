package com.safeplace.service;

import com.safeplace.entity.Chat;
import com.safeplace.entity.Message;
import com.safeplace.entity.User;
import com.safeplace.repository.ChatRepository;
import com.safeplace.repository.MessageRepository;
import com.safeplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    public List<Chat> getUserChats(Long userId) {
        return chatRepository.findByParticipantId(userId);
    }

    public Chat getOrCreateChat(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        return chatRepository.findByTwoParticipants(user1, user2)
                .orElseGet(() -> {
                    Chat newChat = new Chat();
                    newChat.setParticipants(Arrays.asList(user1, user2));
                    return chatRepository.save(newChat);
                });
    }

    public Message sendMessage(Long senderId, Long chatId, String text) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Чат не найден"));

        // Проверяем, что отправитель участвует в этом чате
        boolean isParticipant = chat.getParticipants().stream()
                .anyMatch(user -> user.getId().equals(senderId));

        if (!isParticipant) {
            throw new RuntimeException("Вы не являетесь участником этого чата");
        }

        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setText(text);

        Message savedMessage = messageRepository.save(message);

        // Обновляем последнее сообщение в чате
        chat.setLastMessage(text);
        chatRepository.save(chat);

        // Проверяем, отправлено ли сообщение Ayala AI
        boolean isAyalaChat = chat.getParticipants().stream()
                .anyMatch(user -> "ayala@safeplace.kz".equals(user.getEmail()));

        if (isAyalaChat && !sender.getEmail().equals("ayala@safeplace.kz")) {
            // Генерируем ответ от Ayala AI асинхронно
            generateAyalaResponse(chat, text);
        }

        return savedMessage;
    }

    public List<Message> getChatMessages(Long chatId) {
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    public Chat getOrCreateAyalaChat(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Find or create Ayala user (AI bot account)
        User ayala = userRepository.findByEmail("ayala@safeplace.kz")
                .orElseGet(() -> {
                    // Create Ayala AI bot account if it doesn't exist
                    User newAyala = new User();
                    newAyala.setName("Ayala AI");
                    newAyala.setEmail("ayala@safeplace.kz");
                    newAyala.setPassword("$2a$10$AYALA_LOCKED_ACCOUNT"); // Locked password
                    newAyala.setBio("AI психолог-консультант SafePlace 🤖");
                    newAyala.setRole(com.safeplace.entity.Role.ADMIN);
                    newAyala.setPostsCount(0);
                    newAyala.setCommentsCount(0);
                    newAyala.setFavoritesCount(0);
                    return userRepository.save(newAyala);
                });

        // Check if chat already exists
        return chatRepository.findByTwoParticipants(user, ayala)
                .orElseGet(() -> {
                    // Create new chat
                    Chat newChat = new Chat();
                    newChat.setParticipants(Arrays.asList(user, ayala));
                    Chat savedChat = chatRepository.save(newChat);

                    // Send welcome message from Ayala
                    String welcomeMessage = "Привет! Я Ayala, AI психолог-консультант SafePlace. 🌿\n\n" +
                            "Я здесь, чтобы поддержать тебя в трудные моменты. Ты можешь поделиться со мной своими " +
                            "переживаниями, тревогами или просто поговорить о том, что у тебя на душе.\n\n" +
                            "Все наши разговоры конфиденциальны. Я помогаю при:\n" +
                            "• Тревожности и стрессе 😌\n" +
                            "• Низкой самооценке 💪\n" +
                            "• Сложностях в отношениях 💕\n" +
                            "• Вопросах самопринятия ✨\n\n" +
                            "Напиши мне, когда будешь готов(а). Я всегда на связи! 💗";

                    Message message = new Message();
                    message.setChat(savedChat);
                    message.setSender(ayala);
                    message.setText(welcomeMessage);
                    messageRepository.save(message);

                    // Update last message in chat
                    savedChat.setLastMessage(welcomeMessage);
                    chatRepository.save(savedChat);

                    return savedChat;
                });
    }

    /**
     * Генерирует и сохраняет ответ от Ayala AI на сообщение пользователя
     */
    private void generateAyalaResponse(Chat chat, String userMessage) {
        try {
            // Находим пользователя Ayala
            User ayala = userRepository.findByEmail("ayala@safeplace.kz")
                    .orElseThrow(() -> new RuntimeException("Ayala AI не найдена"));

            // Генерируем ответ через Gemini API
            String aiResponse = geminiService.generateResponse(userMessage);

            // Создаем сообщение от Ayala
            Message ayalaMessage = new Message();
            ayalaMessage.setChat(chat);
            ayalaMessage.setSender(ayala);
            ayalaMessage.setText(aiResponse);

            messageRepository.save(ayalaMessage);

            // Обновляем последнее сообщение в чате
            chat.setLastMessage(aiResponse);
            chatRepository.save(chat);

        } catch (Exception e) {
            // Логируем ошибку, но не прерываем выполнение
            System.err.println("Ошибка при генерации ответа Ayala: " + e.getMessage());
        }
    }
}
