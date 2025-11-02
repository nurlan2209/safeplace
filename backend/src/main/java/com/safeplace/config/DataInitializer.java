package com.safeplace.config;

import com.safeplace.entity.Role;
import com.safeplace.entity.User;
import com.safeplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Ayala psychologist account if it doesn't exist
        if (!userRepository.findByEmail("ayala@safeplace.kz").isPresent()) {
            User ayala = new User();
            ayala.setName("Ayala");
            ayala.setEmail("ayala@safeplace.kz");
            ayala.setPassword(passwordEncoder.encode("ayala_psychologist_2024"));
            ayala.setBio("Психолог-консультант SafePlace. Помогаю при тревожности, низкой самооценке, сложностях в отношениях и самопринятии. Всегда готова выслушать и поддержать вас.");
            ayala.setRole(Role.ADMIN);
            ayala.setPostsCount(0);
            ayala.setCommentsCount(0);
            ayala.setFavoritesCount(0);

            userRepository.save(ayala);
            System.out.println("✓ Ayala psychologist account created successfully!");
        } else {
            System.out.println("✓ Ayala psychologist account already exists");
        }
    }
}
