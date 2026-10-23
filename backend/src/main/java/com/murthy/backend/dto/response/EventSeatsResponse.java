package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class EventSeatsResponse {
    private UUID eventId;
    private String eventName;
    private String venueName;
    private LocalDate date;
    private LocalTime time;
    private List<EventSeatResponse> eventSeats;
}
