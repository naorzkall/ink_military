const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user
const validators = require('../middleware/validators');

router.get('/SignStudent',Auth.isAuth, adminController.getSignStudent);
router.get('/editStudent/:studentId',Auth.isAuth, adminController.getEditStudent);

router.get('/SignEmployee',Auth.isAuth, adminController.getSignEmployee);
router.get('/editEmployee/:employeeId',Auth.isAuth, adminController.getEditEmployee);

router.get('/SignAdmin',Auth.isAuth, adminController.getSignAdmin);
router.get('/editAdmin/:adminId',Auth.isAuth, adminController.getEditAdmin);

router.get('/manageUsers',Auth.isAuth, adminController.manageUsers);
router.post('/delete-user/:userId',Auth.isAuth,adminController.deleteUser);

router.post('/SignAdmin',validators.validateSignUp,Auth.isAuth, adminController.postSignAdmin);
router.post('/editAdmin',validators.validateSignUp,Auth.isAuth, adminController.postEditAdmin);

router.post('/SignEmployee',validators.validateSignUp,Auth.isAuth, adminController.postSignEmployee);
router.post('/editEmployee',validators.validateSignUp,Auth.isAuth, adminController.postEditEmployee);

router.post('/SignStudent',validators.validateStudentSignUp,Auth.isAuth, adminController.postSignStudent);
router.post('/editStudent',validators.validateStudentSignUp,Auth.isAuth, adminController.postEditStudent);


module.exports = router;
