package com.murthy.backend.dto.response;

import com.murthy.backend.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BookingResponse {
    private UUID bookingId;
    private String eventName;
    private List<BookedSeatDetails> seatDetails;
    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;
}
