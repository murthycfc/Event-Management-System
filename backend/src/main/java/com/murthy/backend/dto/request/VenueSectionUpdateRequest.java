package com.murthy.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VenueSectionUpdateRequest {
    private String section;
    private List<VenueSeatUpdateRequest> seats;
}
