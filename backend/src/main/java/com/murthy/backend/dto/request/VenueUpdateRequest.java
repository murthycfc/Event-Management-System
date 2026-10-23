package com.murthy.backend.dto.request;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VenueUpdateRequest {
    private String name;
    private AddressUpdateRequest address;
    private List<VenueSectionUpdateRequest> existingSections;
    @Valid
    private List<VenueSectionRequest> newSections;
}
