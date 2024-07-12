const DefermentRequest = require('../models/defermentRequest');
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

// exports.getRequestDetails = async (req, res) => {
//     try {

//         console.log(req.params)

//         const {requestId} = req.params;

//         // Fetch the deferment request by ID and populate user details
//         const request = await DefermentRequest.findById(requestId).populate('userId', 'name email');
//         console.log(request)
//         if (!request) {
//             return res.status(404).send('Request not found');
//         }

        
//         res.render('deferment-requests/request-details', {
//             request,
//             pageTitle: 'تفاصيل الطلب', 
//             path: 'deferment-requests/request-details'
//         });
//     } catch (error) {
//         // Log the error and send a 500 response with an error message
//         console.error(error);
//         res.status(500).send('خطأ في السيرفر');
//     }
// };

// In controllers/defermentRequests.js
exports.processRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        console.log(requestId)
        // Fetch the request and update the status to 'processing' if it's currently 'pending'
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status:  'قيد المعالجة' },
            { status: 'يعالج' },
            { new: true }
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


// Function to approve a request
exports.approveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        
        // Update the request status to 'approved'
        const request = await DefermentRequest.findOneAndUpdate(
            { _id: requestId, status:  'يعالج' },
            { status: 'مقبول' },

        )
        if (!request) {
            return res.status(404).send('Request not found or not in processing state');
        }

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
            { _id: requestId, status:  'يعالج' },
            { status: 'مرفوض', feedback },
        );
        
        if (!request) {
            return res.status(404).send('Request not found or not in processing state');
        }

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
