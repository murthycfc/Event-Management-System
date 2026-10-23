package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class VenueEditResponse {
    private UUID id;
    private String name;
    private AddressResponse addressResponse;
    private List<VenueSectionResponse> sections;
}
