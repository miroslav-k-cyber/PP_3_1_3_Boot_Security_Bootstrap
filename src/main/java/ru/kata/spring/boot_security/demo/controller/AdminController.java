package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.services.RoleService;

@Controller
public class AdminController {
    
    private final RoleService roleService;
    
    public AdminController(RoleService roleService) {
        this.roleService = roleService;
    }
    
    @GetMapping("/admin")
    public String showAdminPage(Model model) {
        // Передаем список ролей в HTML
        model.addAttribute("allRoles", roleService.getAllRoles());
        return "admin";
    }
}