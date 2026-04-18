package com.attendance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private LocalDate date;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private long durationMinutes;

    private String status; // FULL / PARTIAL / ABSENT
}
