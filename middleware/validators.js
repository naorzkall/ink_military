const { body } = require('express-validator');
const User = require('../models/user');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]{2,50}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const divisionRegex = /^[A-Za-z\s]+$/;
const phoneNumberRegex = /^09\d{8}$/;

exports.validateSignUp = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .matches(emailRegex)
    .withMessage('Invalid email format.')
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('E-Mail exists already, please pick a different one.');
        }
      });
    }),
  body('name')
    .matches(nameRegex)
    .withMessage('Name should only contain alphabets and spaces, and be between 2 and 50 characters long.'),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.'),
  body('division')
    .matches(divisionRegex)
    .withMessage('Division should only contain alphabets and spaces.')
];

exports.validateStudentSignUp = [
  ...exports.validateSignUp,
  body('nationalNumber')
    .isLength({ min: 11, max: 11 })
    .withMessage('National number must be exactly 11 digits.')
    .isNumeric()
    .withMessage('National number must contain only numbers.'),
  body('militaryNumber')
    .isLength({ min: 4, max: 4 })
    .withMessage('Military number must be exactly 4 digits.')
    .isNumeric()
    .withMessage('Military number must contain only numbers.'),
  body('birthdate')
    .isDate()
    .withMessage('Invalid birthdate.'),
  body('delayedTo')
    .isDate()
    .withMessage('Invalid delayedTo.'),
  body('phoneNumber')
    .matches(phoneNumberRegex)
    .withMessage('Phone number must be 10 digits and start with 09.'),
  body('address')
    .notEmpty()
    .withMessage('Address is required.')
];
