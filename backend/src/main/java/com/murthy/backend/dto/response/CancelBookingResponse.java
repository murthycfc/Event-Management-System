package com.murthy.backend.dto.response;

import com.murthy.backend.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class CancelBookingResponse {
    private UUID bookingId;
    private String eventName;
    private BigDecimal paidAmount;
    private int refundPercentage;
    private BigDecimal refundedAmount;
    private BigDecimal cancellationFee;
    private BookingStatus bookingStatus;
}
