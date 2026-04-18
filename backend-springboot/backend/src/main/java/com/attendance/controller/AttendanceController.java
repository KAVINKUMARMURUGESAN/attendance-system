package com.attendance.controller;

import com.attendance.model.Attendance;
import com.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.attendance.repository.StudentRepository;
import com.attendance.model.Student;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository repo;
    private final StudentRepository studentRepo;


    // Receive ENTRY or EXIT event from CV service
    @PostMapping("/event")
    public Attendance handleEvent(@RequestBody EventRequest req) {

        Attendance attendance = repo.findByStudentIdAndDate(
                req.getStudentId(),
                LocalDate.now()
        ).orElseGet(() -> {
            Attendance a = new Attendance();
            a.setStudentId(req.getStudentId());
            a.setDate(LocalDate.now());
            return a;
        });

        if ("ENTRY".equals(req.getEventType())) {
            attendance.setEntryTime(LocalDateTime.now());
        }

        if ("EXIT".equals(req.getEventType())) {
            attendance.setExitTime(LocalDateTime.now());

            if (attendance.getEntryTime() != null) {
                long minutes = Duration.between(
                        attendance.getEntryTime(),
                        attendance.getExitTime()
                ).toMinutes();

                attendance.setDurationMinutes(minutes);

                if (minutes >= 1) attendance.setStatus("FULL");
             //   else if (minutes >= 10) attendance.setStatus("PARTIAL");
                else attendance.setStatus("ABSENT");
            }
        }

        return repo.save(attendance);
    }

    // Get all attendance records
    @GetMapping
    public List<Attendance> getAll() {
        return repo.findAll();
    }

    // Delete attendance
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // Manual update by staff/admin
    @PostMapping("/manual")
    public Attendance manualUpdate(@RequestBody ManualRequest req) {

        Attendance a = repo.findByStudentIdAndDate(req.getStudentId(), LocalDate.now())
                .orElseGet(() -> {
                    Attendance newA = new Attendance();
                    newA.setStudentId(req.getStudentId());
                    newA.setDate(LocalDate.now());
                    return newA;
                });

        a.setStatus(req.getStatus());
        return repo.save(a);
    }

    // Edit entry & exit times
    @PutMapping("/{id}/time")
    public Attendance updateTime(@PathVariable Long id, @RequestBody Attendance updated) {

        Attendance a = repo.findById(id).orElseThrow();

        a.setEntryTime(updated.getEntryTime());
        a.setExitTime(updated.getExitTime());

        if (a.getEntryTime() != null && a.getExitTime() != null) {
            long minutes = Duration.between(a.getEntryTime(), a.getExitTime()).toMinutes();
            a.setDurationMinutes(minutes);

            if (minutes >= 1) a.setStatus("PRESENT");
            else a.setStatus("ABSENT");
        }

        return repo.save(a);
    }
    @GetMapping("/staff/{staffId}")
public List<Attendance> getByStaff(@PathVariable Long staffId) {
    // Get students under staff
    List<Long> studentIds = studentRepo.findByStaffId(staffId)
            .stream()
            .map(s -> s.getId())
            .toList();

    return repo.findByStudentIdIn(studentIds);
}

}
