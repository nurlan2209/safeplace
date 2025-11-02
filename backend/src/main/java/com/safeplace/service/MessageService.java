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

        return savedMessage;
    }

    public List<Message> getChatMessages(Long chatId) {
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    public Chat getOrCreateAyalaChat(Long userId) {
        // Find Ayala user
        User ayala = userRepository.findByEmail("ayala@safeplace.kz")
                .orElseThrow(() -> new RuntimeException("Психолог Ayala не найдена"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Check if chat already exists
        return chatRepository.findByTwoParticipants(user, ayala)
                .orElseGet(() -> {
                    // Create new chat
                    Chat newChat = new Chat();
                    newChat.setParticipants(Arrays.asList(user, ayala));
                    Chat savedChat = chatRepository.save(newChat);

                    // Send welcome message from Ayala
                    String welcomeMessage = "Привет! Я Ayala, психолог-консультант SafePlace. 🌿\n\n" +
                            "Я здесь, чтобы поддержать тебя в трудные моменты. Ты можешь поделиться со мной своими " +
                            "переживаниями, тревогами или просто поговорить о том, что у тебя на душе.\n\n" +
                            "Все наши разговоры конфиденциальны. Я помогаю при:\n" +
                            "• Тревожности и стрессе\n" +
                            "• Низкой самооценке\n" +
                            "• Сложностях в отношениях\n" +
                            "• Вопросах самопринятия\n\n" +
                            "Напиши мне, когда будешь готова. Я всегда на связи. 💗";

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
}
