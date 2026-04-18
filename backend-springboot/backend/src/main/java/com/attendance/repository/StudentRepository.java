package com.attendance.repository;

import com.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByStaffId(Long staffId);

    Optional<Student> findByRegNoAndPassword(String regNo, String password);
}
