package com.murthy.backend.dto.request;

import com.murthy.backend.enums.Row;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VenueSeatUpdateRequest {
    private UUID id;
    private Row row;
    private String seatNo;
    private int xCoordinate;
    private int yCoordinate;
}
