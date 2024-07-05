const express = require('express');
const router = express.Router();
const { isAuth, isStudent, isEmployee,isAdmin } = require('../middleware/is-auth');
const defermentRequestController = require('../controllers/defermentRequestController');

// استلام الطلب مع رفع الملفات
router.post('/submit', defermentRequestController.submitDefermentRequest);

// عرض جميع الطلبات الواردة للموظف
router.get('/all' ,defermentRequestController.getAllRequests);

// عرض تفاصيل طلب محدد
// router.get('/request/:requestId', defermentRequestController.getRequestDetails);

router.post('/request/:id', defermentRequestController.processRequest);

router.post('/request/:id/approve', defermentRequestController.approveRequest);

router.post('/request/:id/reject', defermentRequestController.rejectRequest);

module.exports = router;
