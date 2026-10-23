package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VenueSectionResponse {
    private String section;
    private List<VenueSeatResponse> seats;
}
