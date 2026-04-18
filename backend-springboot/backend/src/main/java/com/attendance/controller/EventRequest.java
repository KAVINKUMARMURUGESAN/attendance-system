package com.attendance.controller;

import lombok.Data;

@Data
public class EventRequest {
    private Long studentId;
    private String eventType; // ENTRY or EXIT
}
