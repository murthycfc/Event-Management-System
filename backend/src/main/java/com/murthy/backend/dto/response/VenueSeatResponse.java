package com.murthy.backend.dto.response;

import com.murthy.backend.enums.Row;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VenueSeatResponse {
    private UUID id;
    private Row row;
    private String seatNo;
    private int xCoordinate;
    private int yCoordinate;
    private boolean isActive;
}
