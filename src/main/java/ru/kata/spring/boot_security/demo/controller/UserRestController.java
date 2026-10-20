package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.User;

@RestController
@RequestMapping("/api/user") // Сюда стучится функция loadCurrentUserInfo() в JS
public class UserRestController {
    
    // Получаем текущего вошедшего пользователя напрямую из контекста Spring Security
    @GetMapping
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        return new ResponseEntity<>(currentUser, HttpStatus.OK);
    }
}
