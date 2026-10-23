package com.murthy.backend.model;

import com.murthy.backend.enums.EventSeatStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name="event_seats")
@Getter
@Setter
public class EventSeat extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "venue_seat_id")
    private VenueSeat venueSeat;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "event_seat_status")
    @Enumerated(EnumType.STRING)
    private EventSeatStatus eventSeatStatus;
}
