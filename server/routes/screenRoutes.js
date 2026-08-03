const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');
const { requireAdmin } = require('../middleware/auth');

router.get('/types/list', screenController.getScreenTypes);
router.get('/', screenController.getAllScreens);
router.get('/:id', screenController.getScreenById);
router.post('/', requireAdmin, screenController.createScreen);
router.put('/:id', requireAdmin, screenController.updateScreen);
router.delete('/:id', requireAdmin, screenController.deleteScreen);

module.exports = router;
