const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user
const validators = require('../middleware/validators');

router.get('/SignStudent',Auth.isAuth,Auth.isAdmin, adminController.getSignStudent);
router.get('/editStudent/:studentId',Auth.isAuth,Auth.isAdmin, adminController.getEditStudent);

router.get('/SignEmployee',Auth.isAuth,Auth.isAdmin, adminController.getSignEmployee);
router.get('/editEmployee/:employeeId',Auth.isAuth,Auth.isAdmin, adminController.getEditEmployee);

router.get('/SignAdmin',Auth.isAuth,Auth.isAdmin, adminController.getSignAdmin);
router.get('/editAdmin/:adminId',Auth.isAuth,Auth.isAdmin, adminController.getEditAdmin);

router.get('/manageUsers',Auth.isAuth,Auth.isAdmin, adminController.manageUsers);
router.post('/delete-user/:userId',Auth.isAuth,Auth.isAdmin,adminController.deleteUser);

router.post('/SignAdmin',validators.validateSignUp,Auth.isAuth,Auth.isAdmin, adminController.postSignAdmin);
router.post('/editAdmin',validators.validateSignUp,Auth.isAuth,Auth.isAdmin, adminController.postEditAdmin);

router.post('/SignEmployee',validators.validateSignUp,Auth.isAuth,Auth.isAdmin, adminController.postSignEmployee);
router.post('/editEmployee',validators.validateSignUp,Auth.isAuth,Auth.isAdmin, adminController.postEditEmployee);

router.post('/SignStudent',validators.validateStudentSignUp,Auth.isAuth,Auth.isAdmin, adminController.postSignStudent);
router.post('/editStudent',validators.validateStudentSignUp,Auth.isAuth,Auth.isAdmin, adminController.postEditStudent);

router.get('/manageDivisions', adminController.getDivisions);
router.post('/addDivision', adminController.addDivision);
router.post('/deleteDivision', adminController.deleteDivision);

module.exports = router;


// [
//   body('email')
//   .custom((value, { req }) => {
//       return User.findOne({ email: value }).then(userDoc => {
//         if (userDoc) {
//           return Promise.reject('E-Mail exists already, please pick a different one.');
//         }
//       });
//   })]