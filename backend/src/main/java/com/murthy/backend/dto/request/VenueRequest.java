package com.murthy.backend.dto.request;

import com.murthy.backend.model.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VenueRequest {
    @NotBlank(message = "name cannot be blank")
    private String name;

    @Valid
    private AddressRequest address;

    @Valid
    @NotEmpty(message = "At least one section is required")
    private List<VenueSectionRequest> sections;

}
