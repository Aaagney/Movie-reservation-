package com.movie.booking.service;

import com.movie.booking.dto.BookingRequest;
import com.movie.booking.dto.BookingResponse;
import com.movie.booking.dto.PriceCalculationResponse;
import com.movie.booking.exception.ResourceNotFoundException;
import com.movie.booking.exception.SeatAlreadyBookedException;
import com.movie.booking.model.*;
import com.movie.booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Calculates the booking price dynamically based on seat categories for a show.
     */
    public PriceCalculationResponse calculatePrice(Long showId, List<Long> seatIds) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + showId));

        List<Seat> seats = seatRepository.findAllById(seatIds);
        if (seats.isEmpty() || seats.size() != seatIds.size()) {
            throw new ResourceNotFoundException("One or more selected seats do not exist.");
        }

        Map<String, PriceCalculationResponse.CategoryBreakdown> breakdown = new HashMap<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Seat seat : seats) {
            // Validate seat belongs to show's screen
            if (!seat.getScreen().getId().equals(show.getScreen().getId())) {
                throw new IllegalArgumentException("Seat " + seat.getSeatNumber() + " does not belong to the screen for this show.");
            }

            BigDecimal seatPrice = getSeatPriceForShow(show, seat.getCategory());
            
            PriceCalculationResponse.CategoryBreakdown catBreakdown = breakdown.computeIfAbsent(seat.getCategory(), 
                k -> new PriceCalculationResponse.CategoryBreakdown(0, seatPrice, BigDecimal.ZERO)
            );
            
            catBreakdown.setCount(catBreakdown.getCount() + 1);
            catBreakdown.setSubtotal(catBreakdown.getSubtotal().add(seatPrice));
            total = total.add(seatPrice);
        }

        return PriceCalculationResponse.builder()
                .showId(showId)
                .seatIds(seatIds)
                .breakdown(breakdown)
                .totalAmount(total)
                .build();
    }

    /**
     * Confirms seat reservations. Creates transaction-safe bookings, maps seats, and records payments.
     */
    @Transactional
    public BookingResponse confirmBooking(BookingRequest request) {
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with ID: " + request.getShowId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.isEmpty() || seats.size() != request.getSeatIds().size()) {
            throw new ResourceNotFoundException("One or more selected seats do not exist.");
        }

        // 1. Concurrency Check: Check if selected seats are already booked
        List<Long> bookedSeatIds = bookingSeatRepository.findBookedSeatIdsByShowId(request.getShowId());
        List<Seat> alreadyBooked = seats.stream()
                .filter(s -> bookedSeatIds.contains(s.getId()))
                .collect(Collectors.toList());

        if (!alreadyBooked.isEmpty()) {
            String seatNumbers = alreadyBooked.stream().map(Seat::getSeatNumber).collect(Collectors.joining(", "));
            throw new SeatAlreadyBookedException("Seat already booked: Seating conflict detected on: " + seatNumbers);
        }

        // 2. Compute Total Price
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<BookingSeat> bookingSeatsList = new ArrayList<>();
        
        // Create Booking Entity
        Booking booking = Booking.builder()
                .show(show)
                .user(user)
                .status("CONFIRMED")
                .build();

        for (Seat seat : seats) {
            if (!seat.getScreen().getId().equals(show.getScreen().getId())) {
                throw new IllegalArgumentException("Seat " + seat.getSeatNumber() + " does not belong to correct screen.");
            }

            BigDecimal price = getSeatPriceForShow(show, seat.getCategory());
            totalAmount = totalAmount.add(price);

            // Construct Join Table elements
            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(booking)
                    .seat(seat)
                    .show(show)
                    .pricePaid(price)
                    .build();
            bookingSeatsList.add(bookingSeat);
        }

        booking.setTotalAmount(totalAmount);
        booking.setBookingSeats(bookingSeatsList);

        // Save Booking
        Booking savedBooking = bookingRepository.save(booking);

        // 3. Record Payment
        Payment payment = Payment.builder()
                .booking(savedBooking)
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .amount(totalAmount)
                .status("SUCCESS")
                .build();
        paymentRepository.save(payment);
        savedBooking.setPayment(payment);

        return mapToBookingResponse(savedBooking);
    }

    /**
     * Cancels a booking, restoring seat availability for future transactions.
     */
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new IllegalArgumentException("Booking is already cancelled.");
        }

        // Cancellation rules: Show date/time must be in the future
        LocalDateTime showDateTime = LocalDateTime.of(booking.getShow().getShowDate(), booking.getShow().getShowTime());
        if (showDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot cancel bookings for past shows.");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    /**
     * Retrieves user booking history logs.
     */
    public List<BookingResponse> getUserBookingHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        
        List<Booking> bookings = bookingRepository.findByUserIdOrderByIdDesc(userId);
        return bookings.stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // Helper Mappers
    // =========================================================================

    private BigDecimal getSeatPriceForShow(Show show, String category) {
        switch (category.toUpperCase()) {
            case "REGULAR":
                return show.getPriceRegular();
            case "PREMIUM":
                return show.getPricePremium();
            case "VIP":
                return show.getPriceVip();
            default:
                throw new IllegalArgumentException("Unknown seat category: " + category);
        }
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        Show show = booking.getShow();
        Movie movie = show.getMovie();
        Screen screen = show.getScreen();
        Theatre theatre = screen.getTheatre();

        List<String> seatNumbers = booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getSeatNumber())
                .collect(Collectors.toList());

        List<Long> seatIds = booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toList());

        String bookingTimeStr = booking.getBookingTime() != null 
                ? booking.getBookingTime().format(DATE_TIME_FORMATTER) 
                : LocalDateTime.now().format(DATE_TIME_FORMATTER);

        return BookingResponse.builder()
                .id(booking.getId())
                .showId(show.getId())
                .userId(booking.getUser().getId())
                .bookingTime(bookingTimeStr)
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .paymentMethod(booking.getPayment() != null ? booking.getPayment().getPaymentMethod() : "MOCK")
                .transactionId(booking.getPayment() != null ? booking.getPayment().getTransactionId() : "TXN_MOCK")
                .seatNumbers(seatNumbers)
                .seatIds(seatIds)
                .movieTitle(movie.getTitle())
                .movieLanguage(movie.getLanguage())
                .theatreName(theatre.getName())
                .screenName(screen.getName())
                .showDate(show.getShowDate().toString())
                .showTime(show.getShowTime().toString())
                .build();
    }
}
