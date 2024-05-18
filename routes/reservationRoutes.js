const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Render the view appointments page
router.get('/view', reservationController.getViewAppointmentsView);

// Get available times for a specific date
router.get('/available-times', reservationController.getAvailableTimes);

// Book a specific appointment
router.post('/book', reservationController.bookSpecificAppointment);

// Render the book appointment page
router.get('/book', reservationController.getBookAppointmentView);

// Get all appointments for today
router.get('/today', reservationController.getAllAppointmentsForToday);

module.exports = router;
