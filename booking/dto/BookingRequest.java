package com.movie.booking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class BookingRequest {

    @NotNull(message = "Show ID is required")
    private Long showId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Seating selection cannot be empty")
    private List<Long> seatIds;

    @NotEmpty(message = "Payment method is required")
    private String paymentMethod;

    @NotEmpty(message = "Transaction ID is required")
    private String transactionId;
}
