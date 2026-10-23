package com.murthy.backend.dto.response;

import com.murthy.backend.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BookingDetails {
    private UUID id;
    private String eventName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<BookedSeatDetails> seatDetails;

    private String venueName;
    private AddressResponse addressResponse;

    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;
}
