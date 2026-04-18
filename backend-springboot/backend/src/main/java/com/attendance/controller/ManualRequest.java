package com.attendance.controller;

import lombok.Data;

@Data
public class ManualRequest {
    private Long studentId;
    private String status;
}
