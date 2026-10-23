package com.murthy.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SectionPriceRequest {
    private BigDecimal price;
}
