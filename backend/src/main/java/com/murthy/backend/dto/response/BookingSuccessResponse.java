package com.murthy.backend.dto.response;

import com.murthy.backend.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BookingSuccessResponse {
    private UUID bookingId;
    private Long bookingNumber;
    private String eventName;
    private List<BookedSeatDetails> seatDetails;
    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;
    private AddressResponse addressResponse;

}
