package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class VenueDetailsPageResponse {
    private UUID id;
    private String name;

    private AddressResponse addressResponse;

    private int totalSections;
    private int totalSeats;

    private Map<String, Integer> sectionSeatCounts;

//    List<VenueSeatResponse> venueSeats;
}
