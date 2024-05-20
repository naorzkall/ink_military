const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the DefermentRequest schema
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
    docUrl: {
        type: String,
        required: true
    },
    status: {
        type: String, // pending/in progress/approved/reject
        required: true
    },
    // we do not need the employee bc we can feltering depending on status field
    // employee: { 
    //     type: Schema.Types.ObjectId,
    //     ref: 'Employee'
    // }, 
    feedback:{
        type: String
    }
    // proofDocument: Buffer,
});

const DefermentRequest = mongoose.model('DefermentRequest', defermentRequestSchema);