package com.movie.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class PriceCalculationResponse {
    private Long showId;
    private List<Long> seatIds;
    private Map<String, CategoryBreakdown> breakdown;
    private BigDecimal totalAmount;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CategoryBreakdown {
        private int count;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}
