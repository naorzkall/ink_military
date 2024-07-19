const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const Auth = require('../middleware/is-auth');
const validators = require('../middleware/validators');


// Render the view appointments page
router.get('/view',Auth.isAuth,Auth.isAdmin, reservationController.getViewAppointmentsView);

// Get available times for a specific date
router.get('/available-times', reservationController.getAvailableTimes);

// Book a specific appointment
router.post('/book',validators.validateِِAppointment, reservationController.bookSpecificAppointment);

// Render the book appointment page
router.get('/book', reservationController.getBookAppointmentView);

// Get all appointments for today
router.get('/today', reservationController.getAllAppointmentsForToday);

module.exports = router;
