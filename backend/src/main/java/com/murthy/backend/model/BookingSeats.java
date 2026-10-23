package com.murthy.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_seats")
@Getter
@Setter
public class BookingSeats extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "event_seat", nullable = false)
    private EventSeat eventSeat;

    @Column(nullable = false)
    private BigDecimal price;

}
