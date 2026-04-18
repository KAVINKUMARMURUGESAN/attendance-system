package com.attendance.config;

import com.attendance.model.Admin;
import com.attendance.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepo;

    @Override
    public void run(String... args) {
        if (adminRepo.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin123"); // change later
            adminRepo.save(admin);
            System.out.println("Default admin created → username: admin | password: admin123");
        }
    }
}
