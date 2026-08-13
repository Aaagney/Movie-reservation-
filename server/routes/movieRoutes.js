const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
<<<<<<< HEAD
const { requireAdmin } = require('../middleware/auth');

router.get('/genres/list', movieController.getGenres);
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', requireAdmin, movieController.createMovie);
router.put('/:id', requireAdmin, movieController.updateMovie);
router.delete('/:id', requireAdmin, movieController.deleteMovie);

module.exports = router;
=======

router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
