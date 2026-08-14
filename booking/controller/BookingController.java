package com.movie.booking.controller;

import com.movie.booking.dto.BookingRequest;
import com.movie.booking.dto.BookingResponse;
import com.movie.booking.dto.PriceCalculationRequest;
import com.movie.booking.dto.PriceCalculationResponse;
import com.movie.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Compute prices dynamically based on seat categories.
     * POST /api/bookings/calculate
     */
    @PostMapping("/calculate")
    public ResponseEntity<PriceCalculationResponse> calculatePrice(@Valid @RequestBody PriceCalculationRequest request) {
        PriceCalculationResponse response = bookingService.calculatePrice(request.getShowId(), request.getSeatIds());
        return ResponseEntity.ok(response);
    }

    /**
     * Confirm a ticket reservation (simulates secure gateway checks & updates states).
     * POST /api/bookings
     */
    @PostMapping
    public ResponseEntity<BookingResponse> confirmBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.confirmBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Cancel an active ticket booking.
     * POST /api/bookings/{id}/cancel
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable("id") Long bookingId) {
        bookingService.cancelBooking(bookingId);
        
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", "Booking cancelled successfully. Restored seat availability.");
        body.put("bookingId", bookingId);
        
        return ResponseEntity.ok(body);
    }
}
