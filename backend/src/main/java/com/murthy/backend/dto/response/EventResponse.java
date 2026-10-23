package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class EventResponse {
    private UUID id;
    private String name;
    private String category;
    private LocalDate date;
    private String city;
    private BigDecimal startingPrice;
}
