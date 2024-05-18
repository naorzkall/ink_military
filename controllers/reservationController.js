const Reservation = require('../models/reservationModel');
const moment = require('moment');

// Render the booking appointment view
exports.getBookAppointmentView = (req, res) => {
  res.render('reservations/bookAppointment', {
    pageTitle: 'حجز موعد',
    path: '/reservations/book',
    availableTimes: [],
    selectedDate: null,
  });
};

// Get available times for a specific date
exports.getAvailableTimes = async (req, res) => {
  const date = new Date(req.query.date);
  try {
    const availableTimes = await Reservation.getAvailableTimes(date);
    res.json(availableTimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book a specific appointment
exports.bookSpecificAppointment = async (req, res) => {
  const { email, name, nationalNumber, date, time } = req.body;
  try {
    const reservation = await Reservation.bookSpecificAppointment(email, name, nationalNumber, new Date(date), time);
    res.render('reservations/success', { time });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Render the view appointments page
exports.getViewAppointmentsView = async (req, res) => {
  try {
    const appointments = await Reservation.find(); // Fetch all appointments
    res.render('reservations/viewAppointments', {
      pageTitle: 'عرض المواعيد',
      path: '/reservations/view',
      appointments: appointments,
      moment: moment, // Include Moment.js for date formatting
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllAppointmentsForToday = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const tomorrow = moment(today).add(1, 'days');

    const appointments = await Reservation.find({
      date: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate()
      }
    });

    res.render('reservations/viewAppointments', {
      pageTitle: 'عرض المواعيد',
      path: '/reservations/view',
      appointments: appointments,
      moment: moment // passing moment to the view
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

