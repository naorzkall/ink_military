const { body } = require('express-validator');
const User = require('../models/user');
const moment = require('moment');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[\u0600-\u06FF\s]{8,50}$/;
const addressRegex = /^[\u0600-\u06FF\s]{5,50}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
// const divisionRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF\s\w]+$/;
const divisionRegex = /^[\u0600-\u06FF\s]+$/;
const phoneNumberRegex = /^09\d{8}$/;

exports.commonValidations = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال البريد الإلكتروني الصحيح.')
    .matches(emailRegex)
    .withMessage('تنسيق البريد الإلكتروني غير صالح.')
    .normalizeEmail(),
  body('name')
    .matches(nameRegex)
    .withMessage('يجب أن يحتوي الاسم فقط على الأحرف الأبجدية العربية والمسافات، وأن يتراوح طوله بين 8 إلى 50 حرفًا.')
    .trim(),
  body('password')
    .matches(passwordRegex)
    .withMessage('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد.'),
  body('division')
    .matches(divisionRegex)
    .withMessage('القسم يجب أن يحتوي على أحرف عربية ومسافات فقط.')
];

exports.validateSignUp = [
  ...exports.commonValidations,
  body('email').custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject('ال Email مستخدم, استخدم Email أخر');
      }
    });
  })
];


exports.commonValidationsStudent = [
  ...exports.commonValidations,
  body('nationalNumber')
    .isLength({ min: 11, max: 11 })
    .withMessage('يجب أن يتكون الرقم الوطني من 11 رقمًا بالضبط.')
    .isNumeric()
    .withMessage('يجب أن يحتوي الرقم الوطني على أرقام فقط.'),
  body('motherName')
    .matches(nameRegex)
    .withMessage('يجب أن يحتوي الاسم فقط على الأحرف الأبجدية العربية والمسافات، وأن يتراوح طوله بين 8 إلى 50 حرفًا.')
    .trim(),
  body('militaryNumber')
    .isLength({ min: 4, max: 4 })
    .withMessage('يجب أن يتكون الرقم العسكري من 4 أرقام بالضبط.')
    .isNumeric()
    .withMessage('يجب أن يحتوي الرقم العسكري على أرقام فقط.'),
  body('birthdate')
    .isDate()
    .withMessage('خطأ في تاريخ الميلاد.')
    .custom((value) => {
      const birthDate = moment(value);
      const now = moment();
      const age = now.diff(birthDate, 'years');
      
      if (age < 17) {
        throw new Error('يجب أن يكون العمر 17 عاما على الأقل');
      }
      if (age > 27) {
        throw new Error('يجب أن يكون العمر أقل من 27.');
      }
      return true;
    }),
  body('phoneNumber')
    .matches(phoneNumberRegex)
    .withMessage('يجب أن يتكون رقم الهاتف من 10 أرقام ويبدأ بـ 09.'),
  body('address')
    .notEmpty()
    .matches(addressRegex)
    .withMessage('يجب أن يحتوي العنوان فقط على الأحرف الأبجدية العربية والمسافات، وأن يتراوح طوله بين 5 إلى 50 حرفًا.')
];

exports.validateSignUpStudent =[
  ...exports.commonValidationsStudent,
  body('email').custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject('ال Email مستخدم, استخدم Email أخر');
      }
    });
  })
];

exports.validateِِAppointment=[
  body('email')
  .isEmail()
  .withMessage('يرجى إدخال البريد الإلكتروني الصحيح.')
  .matches(emailRegex)
  .withMessage('تنسيق البريد الإلكتروني غير صالح.')
  .normalizeEmail(),
body('name')
  .matches(nameRegex)
  .withMessage('يجب أن يحتوي الاسم فقط على الأحرف الأبجدية العربية والمسافات، وأن يتراوح طوله بين 8 إلى 50 حرفًا.')
  .trim(),
body('division')
  .matches(divisionRegex)
  .withMessage('القسم يجب أن يحتوي على أحرف عربية ومسافات فقط.'),
body('nationalNumber')
  .isLength({ min: 11, max: 11 })
  .withMessage('يجب أن يتكون الرقم الوطني من 11 رقمًا بالضبط.')
  .isNumeric()
  .withMessage('يجب أن يحتوي الرقم الوطني على أرقام فقط.'),
];
