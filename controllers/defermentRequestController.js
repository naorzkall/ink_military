const DefermentRequest = require('../models/defermentRequest');
const Employee =require("../models/employee");
exports.submitDefermentRequest = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('Request user:', req.user);

        const { division } = req.user;
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
            status: 'قيد المعالجة'
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
        const { division } = req.user;
        console.log('Request user:', req.user);

        // Fetch deferment requests from the database based on the user's division
        const requests = await DefermentRequest.find({ division, status:  'قيد المعالجة' }).populate('userId');

        res.render('platform/incomingRequests', {
            requests,
            pageTitle: 'الطلبات الواردة', 
            path: 'platform/incomingRequests'
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
        const requestId = req.params.id;
        console.log(requestId);

        // Fetch the request and update the status to 'processing' if it's currently 'pending'
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status: 'قيد المعالجة' },
            { status: 'يعالج' },
            { new: true }
        ).populate('userId', 'name email');

        if (!request) {
            return res.status(404).send('Request not found or already being processed');
        }

        // Fetch the employee who made the request
        const employee = await Employee.findById(request.userId._id);

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

        console.log(employee);
        
        await employee.save();


        res.redirect(`/deferment-requests/my-requests-in-Progress`);

    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

// Function to approve a request
exports.approveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        
        // Update the request status to 'approved'
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status: 'يعالج' },
            { status: 'مقبول' }
        );
        
        if (!request) {
            return res.status(404).send('Request not found or not in processing state');
        }

        // Remove the request from employee's cart
        await Employee.updateOne(
            { _id: request.userId },
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
            { _id: request.userId },
            { $pull: { 'cart.items': { request: requestId } } }
        );

        res.redirect(`/deferment-requests/all`);
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};


exports.getUserRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await DefermentRequest.find({ userId }).populate('userId', 'name email');
        res.render('deferment-requests/user-requests', { requests, pageTitle: 'طلباتي', path: 'deferment-requests/my-requests' });
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
            return res.render('platform/InProgress', {
                employee,
                cartItems: [],
                pageTitle: 'قيد العمل',
                path: 'platform/InProgress',
                message: 'السلة فارغة'
            });
        }

        res.render('platform/InProgress', {
            employee,
            cartItems: employee.cart.items,
            pageTitle: 'قيد العمل',
            path: 'platform/InProgress'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.processRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        console.log(requestId);

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
        console.log(search);
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

        res.redirect('/deferment-requests/allRequests'); // Redirect to the requests list after deletion
    } catch (error) {
        // Log the error and send a 500 response with an error message
        console.error(error);
        res.status(500).send('خطأ في السيرفر'); // Server Error
    }
};

