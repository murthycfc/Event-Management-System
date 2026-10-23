package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SectionPriceResponse {
    private BigDecimal price;
}
