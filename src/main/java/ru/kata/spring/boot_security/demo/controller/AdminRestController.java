package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.UserRequestDto;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {
    
    private final UserService userService;
    
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }
    
    // Получить всех
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    // Получить одного
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    
    // Создать
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserRequestDto requestDto) {
        User user = mapToUser(requestDto);
        userService.saveUser(user, requestDto.getRoleIds());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);  // ← убрана лишняя скобка
    }
    
    // Обновить
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id,       // ← PathVariable, не RequestBody
                                           @RequestBody UserRequestDto requestDto) {
        User user = mapToUser(requestDto);
        user.setId(id);
        userService.updateUser(user, requestDto.getRoleIds());
        return ResponseEntity.ok(user);
    }
    
    // Удалить
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }
    
    // DTO → User
    private User mapToUser(UserRequestDto request) {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAge(request.getAge());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return user;
    }
}