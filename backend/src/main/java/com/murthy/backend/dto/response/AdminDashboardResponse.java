package com.murthy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AdminDashboardResponse {
    private long totalEvents;
    private long totalVenues;
    private long totalBookings;
    private BigDecimal totalRevenue;
}
