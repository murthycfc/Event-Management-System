package com.murthy.backend.dto.request;

import com.murthy.backend.model.VenueSeat;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class EventSeatRequest {
    private UUID venueSeat;
    private BigDecimal price;

}
