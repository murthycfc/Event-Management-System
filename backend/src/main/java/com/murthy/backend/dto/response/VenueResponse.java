package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class VenueResponse {
    private String name;
    private AddressResponse addressResponse;
    List<VenueSectionResponse> sections ;
}
