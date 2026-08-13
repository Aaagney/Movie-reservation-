const express = require('express');
const router = express.Router();
const auditLogsController = require('../controllers/auditLogsController');

// Define audit logs endpoints
router.get('/', auditLogsController.getAuditLogs);
router.post('/', auditLogsController.createAuditLog);

module.exports = router;
