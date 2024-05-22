const Reservation = require('../models/reservationModel');
const moment = require('moment');

// Render the booking appointment view
exports.getBookAppointmentView = (req, res) => {
  res.render('reservations/bookAppointment', {
    pageTitle: 'حجز موعد',
    path: '/reservations/book',
    availableTimes: [],
    selectedDate: null,
    divisions: ['Qaymariya', 'Salihiya', 'Mezzeh', 'Amara', 'Maidan']
  });
};

// Get available times for a specific date and division
exports.getAvailableTimes = async (req, res) => {
  const { date, division } = req.query;
  try {
    const availableTimes = await Reservation.getAvailableTimes(new Date(date), division);
    res.json(availableTimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const divisionNames = {
  Qaymariya: 'قيمرية',
  Salihiya: 'صالحية',
  Mezzeh: 'مزة',
  Amara: 'عمارة',
  Maidan: 'ميدان'
};


// Book a specific appointment
exports.bookSpecificAppointment = async (req, res) => {
  const { email, name, nationalNumber, date, time, division } = req.body;
  try {
    const reservation = await Reservation.bookSpecificAppointment(email, name, nationalNumber, new Date(date), time, division);
    const divisionInArabic = divisionNames[division];
    res.render('reservations/success', { time, division: divisionInArabic });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Render the view appointments page

exports.getViewAppointmentsView = async (req, res) => {
  try {
    const selectedDivision = req.query.division || 'all';
    const today = moment().startOf('day').toDate();
    const tomorrow = moment().add(1, 'days').startOf('day').toDate();
    let query = {
      date: {
        $gte: today,
        $lt: tomorrow
      }
    };

    if (selectedDivision !== 'all') {
      query.division = selectedDivision;
    }

    const appointments = await Reservation.find(query);

    res.render('reservations/viewAppointments', {
      pageTitle: 'عرض المواعيد',
      path: '/reservations/view',
      appointments: appointments,
      moment: moment,
      divisionNames: divisionNames,
      selectedDivision: selectedDivision
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
