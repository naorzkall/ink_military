const Reservation = require('../models/reservationModel');
const moment = require('moment');
const Settings = require('../models/settings');

// Render the booking appointment view
exports.getBookAppointmentView = async (req, res) => {
  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
  res.render('reservations/bookAppointment', {
    pageTitle: 'حجز موعد',
    path: '/reservations/book',
    availableTimes: [],
    selectedDate: null,
    divisions: divisions
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

// const divisionNames = {
//   Qaymariya: 'قيمرية',
//   Salihiya: 'صالحية',
//   Mezzeh: 'مزة',
//   Amara: 'عمارة',
//   Maidan: 'ميدان'
// };


// Book a specific appointment
exports.bookSpecificAppointment = async (req, res) => {
  const { email, name, nationalNumber, date, time, division } = req.body;
  try {
    const reservation = await Reservation.bookSpecificAppointment(email, name, nationalNumber, new Date(date), time, division);
    res.render('reservations/success', { time, division });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Render the view appointments page

exports.getViewAppointmentsViewA = async (req, res) => {
  try {
    const selectedDivision = req.query.division || 'all';
    const today = moment().startOf('day').toDate();
    const tomorrow = moment().add(1, 'days').startOf('day').toDate();
    console.log(division);
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
      // divisionNames: divisionNames,
      selectedDivision: selectedDivision
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getViewAppointmentsView = async (req, res) => {
  try {
    const selectedDivision = req.query.division || 'all';
    const today = moment().startOf('day').toDate();
    const tomorrow = moment().add(1, 'days').startOf('day').toDate();
    const { division } = req.user;
    let query = {
      division : division,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    };

    if (selectedDivision !== 'all') {
      query.division = selectedDivision;
    }
    
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];

    const appointments = await Reservation.find(query);

    res.render('reservations/viewAppointments', {
      pageTitle: 'عرض المواعيد',
      path: '/reservations/view',
      appointments: appointments,
      moment: moment,
      divisionNames: divisions,
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
    const { division } = req.user;
    console.log(division);
    const appointments = await Reservation.find({
      division : division,
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
