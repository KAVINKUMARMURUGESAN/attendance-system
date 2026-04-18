package com.attendance.controller;

import com.attendance.model.Student;
import com.attendance.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository repo;

    @GetMapping
    public List<Student> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Student add(@RequestBody Student student) {
        return repo.save(student);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @GetMapping("/staff/{staffId}")
    public List<Student> getByStaff(@PathVariable Long staffId) {
        return repo.findByStaffId(staffId);
    }
    @PostMapping("/login")
public Student login(@RequestBody Student login) {
    return repo.findByRegNoAndPassword(
            login.getRegNo().trim(),
            login.getPassword().trim()
    ).orElseThrow(() -> new RuntimeException("Invalid credentials"));
}

}
