package com.murthy.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Getter
@Setter
public class EventUpdateRequest {
    private String name;
    private String description;
    private String category;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private Map<String, SectionPriceRequest> eventSeatPrices;
}
