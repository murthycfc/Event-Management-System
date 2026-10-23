package com.murthy.backend.dto.response;

import com.murthy.backend.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
public class MyBookingResponse {
    private UUID bookingId;
    private String eventName;
    private LocalDate eventDate;
    private LocalTime startTime;
    private String venueName;
    private String city;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
}
