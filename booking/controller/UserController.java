package com.movie.booking.controller;

import com.movie.booking.dto.BookingResponse;
import com.movie.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private BookingService bookingService;

    /**
     * Retrieve the booking history list for a user.
     * GET /api/users/{userId}/bookings
     */
    @GetMapping("/{userId}/bookings")
    public ResponseEntity<List<BookingResponse>> getUserBookingHistory(@PathVariable("userId") Long userId) {
        List<BookingResponse> history = bookingService.getUserBookingHistory(userId);
        return ResponseEntity.ok(history);
    }
}
