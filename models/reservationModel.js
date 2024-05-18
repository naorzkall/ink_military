const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nationalNumber: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
    match: /^[0-9]+$/
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
        return value >= tomorrow;
      },
      message: 'Reservations can only be made for future dates.'
    }
  },
  time: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date
});

reservationSchema.pre('save', async function(next) {
  const reservation = this;
  const existingReservation = await Reservation.findOne({
    date: reservation.date,
    time: reservation.time
  });

  if (existingReservation) {
    const error = new Error('A reservation already exists for the selected date and time.');
    error.statusCode = 400;
    return next(error);
  }

  next();
});

reservationSchema.statics.getAvailableTimes = async function(date) {
  const times = ["08:00", "08:20", "08:40", "09:00", "09:20", "09:40", "10:00", "10:20", "10:40", "11:00"];
  const reservations = await this.find({ date });
  const reservedTimes = reservations.map(r => r.time);
  return times.filter(time => !reservedTimes.includes(time));
};

reservationSchema.statics.bookSpecificAppointment = async function(email, name, nationalNumber, date, time) {
  const reservation = new this({ email, name, nationalNumber, date, time });
  return reservation.save();
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
