const DefermentRequest = require('../models/defermentRequest');
exports.submitDefermentRequest = async (req, res, next) => {
    try {
        // console.log('Request body:', req.body);
        // console.log('Request files:', req.files);
        // console.log('Request user:', req.user);

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
            status: 'pending'
        });

        await defermentRequest.save();
        res.status(200).json({
            message: 'Request submitted successfully!',
            identityFile: identityFile,
            certificateFile: certificateFile
        });
    } catch (error) {
        console.error('Error in submitDefermentRequest:', error);
        res.status(500).send('Server error');
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        console.log('Request user:', req.user);
        const requests = await DefermentRequest.find();
        res.render('deferment-requests/all-requests', { requests, pageTitle: 'جميع الطلبات', path: 'deferment-requests/all-requests' });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

exports.getRequestDetails = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const request = await DefermentRequest.findById(requestId);
        res.render('deferment-requests/request-details', { request, pageTitle: 'تفاصيل الطلب', path: `deferment-requests/request/${requestId}` });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

// exports.getUserRequests = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const requests = await DefermentRequest.find({ userId });
//         res.render('deferment-requests/user-requests', { requests, pageTitle: 'طلباتي', path: 'deferment-requests/my-requests' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('خطأ في السيرفر');
//     }
// };
