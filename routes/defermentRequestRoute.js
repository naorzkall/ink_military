const express = require('express');
const router = express.Router();
const { isAuth, isStudent, isEmployee,isAdmin } = require('../middleware/is-auth');
const defermentRequestController = require('../controllers/defermentRequestController');

// استلام الطلب مع رفع الملفات
router.post('/submit', defermentRequestController.submitDefermentRequest);

// عرض جميع الطلبات الواردة للموظف
router.get('/all' ,defermentRequestController.getAllRequests);

//اضافة طلب للسلة
router.post('/request/add-to-cart/:id', defermentRequestController.addRequestToCart);
//قبول طلب
router.post('/request/:id/approve', defermentRequestController.approveRequest);
//رفض طلب
router.post('/request/:id/reject', defermentRequestController.rejectRequest);
//طلبات اليوسر
router.get('/my-requests', defermentRequestController.getUserRequests);
//جيب السلة
router.get('/my-requests-in-Progress', defermentRequestController.getEmployeeCart);
// معالجة من السلة
router.post('/request/:id', defermentRequestController.processRequest);

router.get('/allRequests', defermentRequestController.getAllRequestsForAdmin);

router.get('/viewRequest/:id', defermentRequestController.viewRequest);

router.post('/deleteRequest/:id', defermentRequestController.deleteRequest);
// عرض تفاصيل طلب محدد
// router.get('/request/:requestId', defermentRequestController.getRequestDetails);

module.exports = router;
