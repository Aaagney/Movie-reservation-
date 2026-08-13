const db = require("../config/db");

const addMovie = (req, res) => {
    const { title, genre, duration, description, language } = req.body;

    const sql = `
        INSERT INTO movies (title, genre, duration, description, language)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, genre, duration, description, language],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error adding movie",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Movie added successfully",
                movieId: result.insertId
            });
        }
    );
};
const getAllMovies = (req, res) => {
    const sql = "SELECT * FROM movies";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching movies",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};
const getMovieById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM movies WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching movie",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(results[0]);
    });
};
const updateMovie = (req, res) => {
    const { id } = req.params;
    const { title, genre, duration, description, language } = req.body;

    const sql = `
        UPDATE movies
        SET title = ?, genre = ?, duration = ?, description = ?, language = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, genre, duration, description, language, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error updating movie",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Movie not found"
                });
            }

            res.status(200).json({
                message: "Movie updated successfully"
            });
        }
    );
};
const deleteMovie = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM movies WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting movie",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie deleted successfully"
        });
    });
};
module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie
};