const express = require('express');
const router = express.Router();
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user
const defermentRequestController = require('../controllers/defermentRequestController');

// استلام الطلب مع رفع الملفات
router.post('/submit',Auth.isAuth, defermentRequestController.submitDefermentRequest);

// عرض جميع الطلبات الواردة للموظف
router.get('/all' ,Auth.isAuth,defermentRequestController.getAllRequests);

//اضافة طلب للسلة
router.post('/request/add-to-cart',Auth.isAuth, defermentRequestController.addRequestToCart);
//قبول طلب
router.post('/request/:id/approve',Auth.isAuth, defermentRequestController.approveRequest);
//رفض طلب
router.post('/request/:id/reject',Auth.isAuth, defermentRequestController.rejectRequest);
//طلبات اليوسر
router.get('/my-requests',Auth.isAuth, defermentRequestController.getUserRequests);
//جيب السلة
router.get('/myWorklist',Auth.isAuth,Auth.isEmployee, defermentRequestController.getEmployeeCart);
// معالجة من السلة
router.post('/request/:id',Auth.isAuth, defermentRequestController.processRequest);

router.get('/allRequests',Auth.isAuth, defermentRequestController.getAllRequestsForAdmin);

router.get('/viewRequest/:id',Auth.isAuth, defermentRequestController.viewRequest);

router.post('/deleteRequest/:id',Auth.isAuth, defermentRequestController.deleteRequest);
// عرض تفاصيل طلب محدد
// router.get('/request/:requestId', defermentRequestController.getRequestDetails);

module.exports = router;
