package com.attendance.controller;

import com.attendance.model.Staff;
import com.attendance.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin
@RequiredArgsConstructor
public class StaffController {

    private final StaffRepository repo;

    @GetMapping
    public List<Staff> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Staff add(@RequestBody Staff staff) {
        return repo.save(staff);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PostMapping("/login")
    public Staff login(@RequestBody Staff login) {
        return repo.findByUsernameAndPassword(
                login.getUsername().trim(),
                login.getPassword().trim()
        ).orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
