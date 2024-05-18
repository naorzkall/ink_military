const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

// Define the student schema with additional admin property
const studentSchema = new Schema({
    nationalNumber:{
      type:String,
      required:true,
      minlength: 11,
      maxlength: 11,
      match: /^[0-9]+$/ 
    },
    militaryNumber:{
      type:String,
      required:true,
      minlength: 4,
      maxlength: 4,
      match: /^[0-9]+$/
    },
    birthdate:  {
      type: Date,
      required: true
    },
    phoneNumber:{
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
      match: /^[0-9]+$/ 
    },
    delayedTo:{
      type: Date,
      required: true
    },
    division: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true
    }
  });
  const Student = User.discriminator('Student', studentSchema);

  module.exports = Student;
  