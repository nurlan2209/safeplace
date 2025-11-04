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
        return chatRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public Chat createAyalaChat(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Chat chat = new Chat();
        chat.setUser(user);
        chat.setIsAiChat(true);
        chat.setChatName("Новый чат с Ayala");
        
        Chat savedChat = chatRepository.save(chat);

        String welcomeMessage = "Привет! Я Ayala, AI психолог-консультант. Расскажи, что тебя беспокоит?";
        
        Message message = new Message();
        message.setChat(savedChat);
        message.setText(welcomeMessage);
        message.setIsAiMessage(true);
        messageRepository.save(message);

        savedChat.setLastMessage(welcomeMessage);
        return chatRepository.save(savedChat);
    }

    public Message sendMessage(Long userId, Long chatId, String text) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Чат не найден"));

        if (!chat.getUser().getId().equals(userId)) {
            throw new RuntimeException("Доступ запрещен");
        }

        Message message = new Message();
        message.setChat(chat);
        message.setText(text);
        message.setIsAiMessage(false);
        Message savedMessage = messageRepository.save(message);

        chat.setLastMessage(text);
        chatRepository.save(chat);

        if (chat.getIsAiChat()) {
            generateAyalaResponse(chat, text);
        }

        return savedMessage;
    }

    public void deleteChat(Long userId, Long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Чат не найден"));

        if (!chat.getUser().getId().equals(userId)) {
            throw new RuntimeException("Доступ запрещен");
        }

        // First remove messages referencing the chat to avoid FK constraint problems
        messageRepository.deleteByChatId(chatId);

        // Then remove the chat itself
        chatRepository.deleteById(chatId);
    }

    public List<Message> getChatMessages(Long chatId) {
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    private void generateAyalaResponse(Chat chat, String userMessage) {
        try {
            String aiResponse = geminiService.generateResponse(userMessage);

            Message ayalaMessage = new Message();
            ayalaMessage.setChat(chat);
            ayalaMessage.setText(aiResponse);
            ayalaMessage.setIsAiMessage(true);
            messageRepository.save(ayalaMessage);

            chat.setLastMessage(aiResponse);
            chatRepository.save(chat);
        } catch (Exception e) {
            System.err.println("Ошибка AI: " + e.getMessage());
        }
    }
}