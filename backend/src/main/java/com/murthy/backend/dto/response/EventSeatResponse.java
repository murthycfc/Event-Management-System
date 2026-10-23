package com.murthy.backend.dto.response;

import com.murthy.backend.enums.EventSeatStatus;
import com.murthy.backend.enums.Row;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class EventSeatResponse {
    private UUID id;
    private String section;
    private Row row;
    private String seatNo;
    private int xCoordinate;
    private int yCoordinate;
    private BigDecimal price;
    private EventSeatStatus eventSeatStatus;
}
