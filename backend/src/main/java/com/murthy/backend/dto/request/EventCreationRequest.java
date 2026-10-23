package com.murthy.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class EventCreationRequest {
    private String name;
    private String description;
    private String category;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
//    private LocalDate bookingEndDate;
//    private LocalTime bookingEndTime;

    private UUID venueId;
    private Map<String, SectionPriceRequest> eventSeatPrices;
}
