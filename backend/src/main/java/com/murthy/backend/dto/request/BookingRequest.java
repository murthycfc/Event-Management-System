package com.murthy.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BookingRequest {
    private List<UUID> eventSeatIds;
}
