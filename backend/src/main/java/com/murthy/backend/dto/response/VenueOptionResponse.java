package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VenueOptionResponse {
    private UUID id;
    private String name;
}
