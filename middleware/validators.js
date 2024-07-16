const { body } = require('express-validator');
const User = require('../models/user');
const moment = require('moment');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]{2,50}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
// const divisionRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF\s\w]+$/;
const divisionRegex = /^[\u0600-\u06FF\s]+$/;
const phoneNumberRegex = /^09\d{8}$/;

exports.commonValidations = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .matches(emailRegex)
    .withMessage('Invalid email format.')
    .normalizeEmail(),
  body('name')
    .matches(nameRegex)
    .withMessage('Name should only contain alphabets and spaces, and be between 2 and 50 characters long.')
    .trim(),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.'),
  body('division')
    .matches(divisionRegex)
    .withMessage('Division should only contain alphabets and spaces.')
];

exports.validateSignUp = [
  ...exports.commonValidations,
  body('email').custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject('E-Mail exists already, please pick a different one.');
      }
    });
  })
];


exports.commonValidationsStudent = [
  ...exports.commonValidations,
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
    .withMessage('Invalid birthdate.')
    .custom((value) => {
      const birthDate = moment(value);
      const now = moment();
      const age = now.diff(birthDate, 'years');
      
      if (age < 17) {
        throw new Error('You must be at least 17 years old.');
      }
      if (age > 27) {
        throw new Error('You must be younger than 27 years old.');
      }
      return true;
    }),
  body('delayedTo')
    .isDate()
    .withMessage('Invalid delayedTo date.')
    .isAfter(new Date().toISOString())
    .withMessage('DelayedTo date must be in the future.'),
  body('phoneNumber')
    .matches(phoneNumberRegex)
    .withMessage('Phone number must be 10 digits and start with 09.'),
  body('address')
    .notEmpty()
    .withMessage('Address is required.')
];

exports.validateSignUpStudent =[
  ...exports.commonValidationsStudent,
  body('email').custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject('E-Mail exists already, please pick a different one.');
      }
    });
  })
];