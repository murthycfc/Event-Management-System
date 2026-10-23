package com.murthy.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VenueSectionRequest {

    @NotBlank(message = "section cannot be blank")
    private String section;

    @Valid
    @NotEmpty(message = "At least 1 row is required")
    private List<RowRequest> rows;
}
