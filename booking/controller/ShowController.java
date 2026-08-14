package com.movie.booking.controller;

import com.movie.booking.model.Seat;
import com.movie.booking.model.Show;
import com.movie.booking.repository.SeatRepository;
import com.movie.booking.repository.ShowRepository;
import com.movie.booking.repository.BookingSeatRepository;
import com.movie.booking.exception.ResourceNotFoundException;
import lombok.Builder;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    /**
     * Retrieve the seat grid layout with booked status for a show.
     * GET /api/shows/{showId}/seats
     */
    @GetMapping("/{showId}/seats")
    public ResponseEntity<List<SeatStatusDto>> getShowSeatLayout(@PathVariable("showId") Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + showId));

        Long screenId = show.getScreen().getId();
        List<Seat> screenSeats = seatRepository.findByScreenId(screenId);
        List<Long> bookedSeatIds = bookingSeatRepository.findBookedSeatIdsByShowId(showId);

        List<SeatStatusDto> layout = new ArrayList<>();
        for (Seat seat : screenSeats) {
            boolean isBooked = bookedSeatIds.contains(seat.getId());
            BigDecimal price = getSeatPriceForShow(show, seat.getCategory());

            layout.add(SeatStatusDto.builder()
                    .id(seat.getId())
                    .screenId(screenId)
                    .seatNumber(seat.getSeatNumber())
                    .rowName(seat.getRowName())
                    .colNumber(seat.getColNumber())
                    .category(seat.getCategory())
                    .status(isBooked ? "BOOKED" : "AVAILABLE")
                    .price(price)
                    .build());
        }

        return ResponseEntity.ok(layout);
    }

    private BigDecimal getSeatPriceForShow(Show show, String category) {
        switch (category.toUpperCase()) {
            case "REGULAR":
                return show.getPriceRegular();
            case "PREMIUM":
                return show.getPricePremium();
            case "VIP":
                return show.getPriceVip();
            default:
                return show.getPriceRegular();
        }
    }

    @Getter
    @Builder
    public static class SeatStatusDto {
        private Long id;
        private Long screenId;
        private String seatNumber;
        private String rowName;
        private Integer colNumber;
        private String category;
        private String status; // 'AVAILABLE', 'BOOKED'
        private BigDecimal price;
    }
}
