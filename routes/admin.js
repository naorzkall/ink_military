const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/SignStudent', adminController.getSignStudent);

router.get('/SignEmployee', adminController.getSignEmployee);

router.get('/SignAdmin', adminController.getSignAdmin);

module.exports = router;
