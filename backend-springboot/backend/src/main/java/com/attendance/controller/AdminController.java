package com.attendance.controller;

import com.attendance.model.Admin;
import com.attendance.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository repo;

    @PostMapping("/login")
    public Admin login(@RequestBody Admin login) {
        return repo.findByUsernameAndPassword(
                login.getUsername().trim(),
                login.getPassword().trim()
        ).orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
