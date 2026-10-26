package com.murthy.backend.dto.response;

import com.murthy.backend.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class AdminBookingsListResponse {
    private UUID id;
    private Long bookingNumber;
    private String event;
    private String venue;
    private LocalDate date;
    private LocalTime startTime;
    private String user;
    private BookingStatus status;
}
