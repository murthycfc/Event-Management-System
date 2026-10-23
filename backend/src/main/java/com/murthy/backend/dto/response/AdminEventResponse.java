package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
public class AdminEventResponse {
    private UUID id;
    private String name;
    private String category;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
