package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class AdminEventDetailsResponse {
    private UUID id;
    private String name;
    private String description;
    private String category;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private UUID venueId;
    private String venueName;
    private Map<String, SectionPriceResponse> eventSeatPrices;
}
