package com.movie.booking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"screen_id", "seat_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "row_name", nullable = false, length = 5)
    private String rowName;

    @Column(name = "col_number", nullable = false)
    private Integer colNumber;

    @Column(nullable = false, length = 20)
    private String category; // 'REGULAR', 'PREMIUM', 'VIP'
}
