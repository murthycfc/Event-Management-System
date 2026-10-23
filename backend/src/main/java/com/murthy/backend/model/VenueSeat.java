package com.murthy.backend.model;

import com.murthy.backend.enums.Row;
import com.murthy.backend.enums.Type;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "venue_seats")
@Getter
@Setter
public class VenueSeat extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private String section;

    @Column(name ="seat_row",nullable = false)
    @Enumerated( EnumType.STRING)
    private Row row;

    @Column(nullable = false, name = "seat_no")
    private String seatNo;

    @Column(nullable = false, name = "x_coordinate")
    private int xCoordinate;

    @Column(nullable = false, name = "y_coordinate")
    private int yCoordinate;
}
