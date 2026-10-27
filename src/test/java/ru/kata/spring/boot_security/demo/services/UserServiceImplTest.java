package ru.kata.spring.boot_security.demo.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    
    @Mock private UserRepository userRepository;
    @Mock private RoleService roleService;
    @Mock private PasswordEncoder passwordEncoder;
    
    @InjectMocks private UserServiceImpl userService;
    
    @Test
    void saveUser_shouldEncodePasswordAndSetRoles() {
        User user = new User();
        user.setPassword("raw");
        List<Long> roleIds = List.of(1L);
        List<Role> roles = List.of(new Role("ROLE_USER"));
        
        when(passwordEncoder.encode("raw")).thenReturn("encoded");
        when(roleService.findRolesByIds(roleIds)).thenReturn(roles);
        
        userService.saveUser(user, roleIds);
        
        assertThat(user.getPassword()).isEqualTo("encoded");
        assertThat(user.getRoles()).hasSize(1);
        verify(userRepository).save(user);
    }
    
    @Test
    void deleteUser_shouldCallDeleteById() {
        userService.deleteUser(1L);
        verify(userRepository).deleteById(1L);
    }
}