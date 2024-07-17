const express = require('express');
const router = express.Router();
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user
const defermentRequestController = require('../controllers/defermentRequestController');

// استلام الطلب مع رفع الملفات
router.post('/submit',Auth.isAuth, defermentRequestController.submitDefermentRequest);

// عرض جميع الطلبات الواردة للموظف
router.get('/all' ,Auth.isAuth,defermentRequestController.getAllRequests);

//اضافة طلب للسلة
router.post('/request/add-to-cart',Auth.isAuth,Auth.isEmployee, defermentRequestController.addRequestToCart);
//قبول طلب
router.post('/request/:id/approve',Auth.isAuth,Auth.isEmployee, defermentRequestController.approveRequest);
//رفض طلب
router.post('/request/:id/reject',Auth.isAuth,Auth.isEmployee, defermentRequestController.rejectRequest);
//طلبات اليوسر
router.get('/my-request',Auth.isAuth,Auth.isStudent, defermentRequestController.getUserRequest);
//جيب السلة
router.get('/myWorklist',Auth.isAuth,Auth.isEmployee, defermentRequestController.getEmployeeCart);
// معالجة من السلة
router.get('/request/:id',Auth.isAuth,Auth.isEmployee, defermentRequestController.processRequest);

router.get('/allRequests',Auth.isAuth, defermentRequestController.getAllRequestsForAdmin);

router.get('/viewRequest/:id',Auth.isAuth, defermentRequestController.viewRequest);

router.post('/deleteRequest/:id',Auth.isAuth, defermentRequestController.deleteRequest);

router.post('/request/:id/reject-with-resend',Auth.isAuth,Auth.isEmployee, defermentRequestController.rejectRequestWithResend);

// عرض تفاصيل طلب محدد
// router.get('/request/:requestId', defermentRequestController.getRequestDetails);

module.exports = router;
