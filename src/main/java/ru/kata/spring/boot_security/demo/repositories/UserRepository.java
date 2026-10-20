package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User getUserById(Long id);
    
    // Возвращаем Optional<User>, чтобы работал orElseThrow
    Optional<User> findByEmail(String email);
}