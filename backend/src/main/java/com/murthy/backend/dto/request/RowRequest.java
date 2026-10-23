package com.murthy.backend.dto.request;

import com.murthy.backend.enums.Row;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RowRequest {

    @NotNull(message = "Row letter is required")
    private Row row;

    @Positive(message = "Row number must be greater than 0")
    private Integer rowNumber;

    @Min(value = 1, message = "Row count must be at least 1")
    private Integer rowCount;
}
