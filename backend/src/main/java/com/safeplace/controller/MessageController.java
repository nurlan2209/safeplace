package com.safeplace.controller;

import com.safeplace.entity.Chat;
import com.safeplace.entity.Message;
import com.safeplace.security.CurrentUser;
import com.safeplace.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private CurrentUser currentUser;

    @GetMapping("/chats")
    public ResponseEntity<List<Chat>> getUserChats() {
        Long userId = currentUser.getId();
        List<Chat> chats = messageService.getUserChats(userId);
        return ResponseEntity.ok(chats);
    }

    @PostMapping("/chats")
    public ResponseEntity<Chat> getOrCreateChat(@RequestBody Map<String, Long> request) {
        Long userId = currentUser.getId();
        Long otherUserId = request.get("userId");
        Chat chat = messageService.getOrCreateChat(userId, otherUserId);
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/chats/{chatId}/messages")
    public ResponseEntity<Message> sendMessage(@PathVariable Long chatId,
                                               @RequestBody Map<String, String> request) {
        Long userId = currentUser.getId();
        String text = request.get("text");
        Message message = messageService.sendMessage(userId, chatId, text);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/chats/{chatId}/messages")
    public ResponseEntity<List<Message>> getChatMessages(@PathVariable Long chatId) {
        List<Message> messages = messageService.getChatMessages(chatId);
        return ResponseEntity.ok(messages);
    }
}
