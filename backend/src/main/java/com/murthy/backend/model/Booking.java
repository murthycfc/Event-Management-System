package com.murthy.backend.model;

import com.murthy.backend.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
public class Booking extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "booking_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Column(name="booking_number", unique = true)
    private Long bookingNumber;

    @Column(name = "cancellation_fee")
    private BigDecimal cancellationFee;

    @Column(name = "refunded_amount")
    private BigDecimal refundedAmount;

    @OneToMany(mappedBy = "booking", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<BookingSeats> bookingSeats = new ArrayList<>();
}
