// backend/src/main/java/com/safeplace/repository/MessageRepository.java
package com.safeplace.repository;

import com.safeplace.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);
    
    // Delete all messages that belong to a chat (used when removing a chat)
    void deleteByChatId(Long chatId);
}