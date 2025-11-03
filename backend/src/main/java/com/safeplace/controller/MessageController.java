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
        return ResponseEntity.ok(messageService.getUserChats(currentUser.getId()));
    }

    @PostMapping("/chats/ayala")
    public ResponseEntity<Chat> createAyalaChat() {
        return ResponseEntity.ok(messageService.createAyalaChat(currentUser.getId()));
    }

    @PostMapping("/chats/{chatId}/messages")
    public ResponseEntity<Message> sendMessage(@PathVariable Long chatId, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(messageService.sendMessage(currentUser.getId(), chatId, request.get("text")));
    }

    @GetMapping("/chats/{chatId}/messages")
    public ResponseEntity<List<Message>> getChatMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(messageService.getChatMessages(chatId));
    }
}