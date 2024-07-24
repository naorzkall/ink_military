const DefermentRequest = require('../models/defermentRequest');
const Employee =require("../models/employee");
const Student = require('../models/student');
const fs = require('fs');

const nodemailer = require('nodemailer'); 
const generateEmailTemplate = require('../controllers/email');
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
      user: process.env.NODEJS_GMAIL_APP_USER,   // your email address
      pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
  }
});

exports.submitDefermentRequest = async (req, res, next) => {

    balance =  req.user.balance;

    if (balance<5){
        req.flash('errorMessage', 'محفظتك تحوي أقل من 5$')
        return res.redirect('/addRequest');
    }

    try {

        const { division,email } = req.user;
        const identityFile = req.files['identity'] ? req.files['identity'][0] : null;
        const certificateFile = req.files['certificate'] ? req.files['certificate'][0] : null;

        if (!identityFile || !certificateFile) {
            return res.status(400).send('Identity and certificate files are required.');
        }

        const defermentRequest = new DefermentRequest({
            userId: req.user._id,
            division,
            identityUrl: identityFile.path,
            certificateUrl: certificateFile.path,
            status: 'قيد المعالجة',
            email
        });

        await defermentRequest.save();
        res.redirect(`/`);
    } catch (error) {
        console.error('Error in submitDefermentRequest:', error);
        res.status(500).send('Server error');
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const userType = req.user.user_type;
        // console.log(userType);
        const { division } = req.user;

        // Fetch deferment requests from the database based on the user's division
        const requests = await DefermentRequest.find({ division, status:  'قيد المعالجة' }).populate('userId');

        res.render('platform/incomingRequests', {
            requests,
            pageTitle: 'الطلبات الواردة', 
            path: 'platform/incomingRequests',
            userType:userType
        });
    } catch (error) {
        // Log the error and send a 500 response with an error message
        console.error(error);
        res.status(500).send('خطأ في السيرفر'); // Arabic for 'Server Error'
    }
};

exports.viewRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        // Fetch the specific request by ID from the database
        const request = await DefermentRequest.findById(requestId).populate('userId');

        if (!request) {
            return res.status(404).send('الطلب غير موجود'); // Request not found
        }

        res.render('deferment-requests/viewRequest', {
            request,
            pageTitle: 'تفاصيل الطلب',
            path: '/deferment-requests/viewRequest'
        });
        
    } catch (error) {
        // Log the error and send a 500 response with an error message
        console.error(error);
        res.status(500).send('خطأ في السيرفر'); // Server Error
    }
};


exports.addRequestToCart = async (req, res) => {
    try {
        const requestId = req.body.requestId;

        // Fetch the request and update the status to 'processing' if it's currently 'pending'
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status: 'قيد المعالجة' },
            { status: 'يعالج' ,processedBy: req.user._id},
            { new: true }
        ).populate('userId', 'name email');

        if (!request) {
            return res.status(404).send('Request not found or already being processed');
        }

        // Fetch the employee who made the request
        const employee = req.user;



        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        // Add the request to the employee's cart
        const cartItemIndex = employee.cart.items.findIndex(cp => {
            return cp.request.toString() === request._id.toString();
        });

        if (cartItemIndex >= 0) {
            // If request already in cart, increase quantity
            employee.cart.items[cartItemIndex].quantity += 1;
        } else {
            // If request not in cart, add new item
            employee.cart.items.push({
                request: request._id,
                quantity: 1
            });
        }

        
        await employee.save();


        res.redirect(`/deferment-requests/myWorklist`);

    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

// Function to approve a request
exports.approveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        
        let defermentDocumentUrl = null;

        if (req.files && req.files.defermentDocument && req.files.defermentDocument[0]) {
            const defermentDocument = req.files.defermentDocument[0];
            defermentDocumentUrl = defermentDocument.path.replace("\\", "/");
        }

        // Update the request status to 'approved' and add the document URL if it exists
        const updateData = { status: 'مقبول' };
        if (defermentDocumentUrl) {
            updateData.defermentDocumentUrl = defermentDocumentUrl;
        }

        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status: 'يعالج' },
            updateData,
            { new: true }
        );
        
        if (!request) {
            // If a file was uploaded, delete it
            if (defermentDocumentUrl) {
                fs.unlink(path.join(__dirname, '..', defermentDocumentUrl), (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
            return res.status(404).send('Request not found or not in processing state');
        }

        await Student.updateOne(
            { _id: request.userId },
            [
                { $set: { 
                    balance: { $subtract: ['$balance', 5] },
                    delayedTo: { 
                        $dateAdd: {
                            startDate: '$delayedTo',
                            unit: 'year',
                            amount: 1
                        }
                    }
                }}
            ]
        );

        const email = request.email;
        const emailHtml = generateEmailTemplate('حالة طلب التأجيل', 'تمت الموافقة على طلب التأجيل');
        await transporter.sendMail({
          from: process.env.NODEJS_GMAIL_APP_USER,
          to: email,
          subject: 'حالة طلب التأجيل',
          html: emailHtml
        });
        // Remove the request from employee's cart
        await Employee.updateOne(
            { _id: req.user._id },
            { $pull: { 'cart.items': { request: requestId } } }
        );

        res.redirect(`/deferment-requests/all`);
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

// Function to reject a request
exports.rejectRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { feedback } = req.body;
        
        // Update the request status to 'rejected' and add feedback
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status: 'يعالج' },
            { status: 'مرفوض', feedback }
        );
        
        if (!request) {
            return res.status(404).send('Request not found or not in processing state');
        }

        // Remove the request from employee's cart
        await Employee.updateOne(
            { _id: req.user._id },
            { $pull: { 'cart.items': { request: requestId } } }
        );
        const email = request.email;
        const emailHtml = generateEmailTemplate('حالة طلب التأجيل', 'تمت رفض طلب التأجيل');
        await transporter.sendMail({
          from: process.env.NODEJS_GMAIL_APP_USER,
          to: email,
          subject: 'حالة طلب التأجيل',
          html: emailHtml
        });

        res.redirect(`/deferment-requests/all`);
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.rejectRequestWithResend = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { feedback } = req.body;

        // Update the request status to 'rejected' and add feedback
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status: 'يعالج' },
            { status: 'مرفوض - للتعديل', feedback }
        );
        
        if (!request) {
            return res.status(404).send('Request not found or not in processing state');
        }

        // Remove the request from employee's cart
        await Employee.updateOne(
            { _id: req.user._id },
            { $pull: { 'cart.items': { request: requestId } } }
        );

        res.redirect(`/deferment-requests/all`);
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.getUserRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1); // بداية السنة الحالية
        const endOfYear = new Date(currentYear + 1, 0, 1); // بداية السنة القادمة

        const request = await DefermentRequest.findOne({
            userId,
            createdAt: { $gte: startOfYear, $lt: endOfYear } // تحديد الطلبات في السنة الحالية
            }).sort({ createdAt: -1 }) // ترتيب تنازلي حسب تاريخ الإنشاء
            .populate('userId', 'name email');

        res.render('deferment-requests/user-request', { 
            mes:"",
            request,
            pageTitle: 'طلباتي',
            path: 'deferment-requests/my-request' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.getEmployeeCart = async (req, res) => {
    try {
        const employeeId = req.user._id; // Assuming the employee ID is passed in the request parameters

        // Fetch the employee and populate the cart items with full request details
        const employee = await Employee.findById(employeeId).populate('cart.items.request');

        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        // Check if the cart is empty
        if (!employee.cart || !employee.cart.items || employee.cart.items.length === 0) {
            return res.render('platform/myWorklist', {
                employee,
                cartItems: [],
                pageTitle: 'قيد العمل',
                path: 'platform/myWorklist',
                message: 'السلة فارغة'
            });
        }

        res.render('platform/myWorklist', {
            employee,
            cartItems: employee.cart.items,
            pageTitle: 'قيد العمل',
            path: 'platform/myWorklist'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.processRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        const request = await DefermentRequest.findOne(
            { _id: requestId }
        ).populate('userId', 'name email');

        if (!request) {
            return res.status(404).send('Request not found or already being processed');
        }

        res.render('deferment-requests/request-details', {
            request,
            pageTitle: 'تفاصيل الطلب',
            path: 'deferment-requests/request-details'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.getAllRequestsForAdmin = async (req, res) => {
    try {
        const { division } = req.user;
        let { requestStatus = 'all', search = '' } = req.query;

        // Build query object based on filters
        let query = { division };
        
        if (requestStatus !== 'all' && requestStatus !== 'يعالج') {
            query.status = requestStatus;
        } else if (requestStatus === 'يعالج') {
            query.status = { $ne: 'مقبول', $ne: 'مرفوض' }; // Example condition for "in progress"
        }

        if (search) {
            query.$or = [
                { 'userId.name': { $regex: search, $options: 'i' } },
                { 'status': { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch deferment requests from the database based on the user's division
        const requests = await DefermentRequest.find(query).populate('userId');

        res.render('admin/AllRequestsForAdmin', {
            requests,
            currentStatus: requestStatus,
            searchQuery: search,
            pageTitle: 'الطلبات الواردة',
            path: 'admin/AllRequestsForAdmin'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};


exports.deleteRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        // Find and delete the request by ID
        const request = await DefermentRequest.findByIdAndDelete(requestId);

        if (!request) {
            return res.status(404).send('الطلب غير موجود'); // Request not found
        }
        await Employee.updateOne(
            { _id: request.processedBy },
            { $pull: { 'cart.items': { request: requestId } } }
        );
        res.redirect('/deferment-requests/allRequests'); // Redirect to the requests list after deletion
    } catch (error) {
        // Log the error and send a 500 response with an error message
        console.error(error);
        res.status(500).send('خطأ في السيرفر'); // Server Error
    }
};