const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// تعريف نموذج طلب التأجيل
const defermentRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    division: {
        type: String,
        required: true
    },
    identityUrl: {
        type: String,
        required: true
    },
    certificateUrl: {
        type: String,
        required: true
    },
    status: {
        type: String, // pending/in progress/approved/rejected
        required: true
    },
    feedback: {
        type: String
    }
}, { timestamps: true });

const DefermentRequest = mongoose.model('DefermentRequest', defermentRequestSchema);

module.exports = DefermentRequest;
