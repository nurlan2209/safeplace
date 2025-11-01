package com.safeplace.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Component to verify database schema initialization
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseInitializer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void verifyDatabaseSchema() {
        log.info("===== Database Schema Verification =====");

        try {
            // Query to get all tables in SQLite database
            String sql = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name";
            List<String> tables = jdbcTemplate.queryForList(sql, String.class);

            if (tables.isEmpty()) {
                log.warn("WARNING: No tables found in database!");
            } else {
                log.info("Found {} tables in database:", tables.size());
                tables.forEach(table -> log.info("  - {}", table));
            }

            // Verify expected tables exist
            List<String> expectedTables = List.of(
                "users", "posts", "comments", "favorites",
                "chats", "chat_participants", "messages"
            );

            for (String expectedTable : expectedTables) {
                if (tables.contains(expectedTable)) {
                    Long count = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM " + expectedTable,
                        Long.class
                    );
                    log.info("Table '{}' exists with {} records", expectedTable, count);
                } else {
                    log.error("ERROR: Expected table '{}' does not exist!", expectedTable);
                }
            }

        } catch (Exception e) {
            log.error("Error verifying database schema", e);
        }

        log.info("===== End Database Schema Verification =====");
    }
}
