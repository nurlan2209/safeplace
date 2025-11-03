package com.safeplace.repository;

import com.safeplace.entity.Chat;
import com.safeplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByUserIdOrderByUpdatedAtDesc(Long userId);
}