package com.movie.booking.controller;

import com.movie.booking.model.Movie;
import com.movie.booking.model.Show;
import com.movie.booking.repository.MovieRepository;
import com.movie.booking.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowRepository showRepository;

    /**
     * Retrieve all active movies.
     * GET /api/movies
     */
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return ResponseEntity.ok(movies);
    }

    /**
     * Retrieve scheduled shows for a movie.
     * GET /api/movies/{id}/shows
     */
    @GetMapping("/{id}/shows")
    public ResponseEntity<List<Show>> getMovieShows(@PathVariable("id") Long movieId) {
        List<Show> shows = showRepository.findByMovieId(movieId);
        return ResponseEntity.ok(shows);
    }
}
