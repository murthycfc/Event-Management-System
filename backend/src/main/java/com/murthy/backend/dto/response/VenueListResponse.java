package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VenueListResponse {
    private UUID id;
    private String name;
    private String city;
    private String state;
    private int totalSections;
    private int totalSeats;
}
