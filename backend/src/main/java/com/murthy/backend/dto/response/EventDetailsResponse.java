package com.murthy.backend.dto.response;

import com.murthy.backend.model.Address;
import com.murthy.backend.model.Venue;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class EventDetailsResponse {
    private String name;
    private String description;
    private String category;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
//    private LocalDate bookingEndDate;
//    private LocalTime bookingEndTime;
    private String venueName;
    private AddressResponse address;
}
