package com.movie.booking.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "shows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @Column(name = "show_time", nullable = false)
    private LocalTime showTime;

    @Column(name = "price_regular", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceRegular;

    @Column(name = "price_premium", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePremium;

    @Column(name = "price_vip", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceVip;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
