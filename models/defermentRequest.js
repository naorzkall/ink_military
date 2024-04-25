const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the DefermentRequest schema
const defermentRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    docUrl: {
        type: String,
        required: true
    },
    status: {
        type: String, // pending/in progress/approved/reject
        required: true
    },
    employee: { 
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    feedback:{
        type: String,
        required: true
    }
    // proofDocument: Buffer,
});

const DefermentRequest = mongoose.model('DefermentRequest', defermentRequestSchema);