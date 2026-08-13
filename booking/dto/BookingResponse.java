package com.movie.booking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class BookingResponse {
    private Long id;
    private Long showId;
    private Long userId;
    private String bookingTime;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String transactionId;
    
    // Seat Details
    private List<String> seatNumbers;
    private List<Long> seatIds;

    // Movie, Screen & Theatre Metadata
    private String movieTitle;
    private String movieLanguage;
    private String theatreName;
    private String screenName;
    private String showDate;
    private String showTime;
}
