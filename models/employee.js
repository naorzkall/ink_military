const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

// Define the Admin schema with additional admin property
const employeeSchema = new Schema({
    division: {
      type: String,
      required: true
    },
    cart: {
      items: [
        {
          request: {
            type: Schema.Types.ObjectId,
            ref: 'DefermentRequest',
            required: true
          },
          quantity: { type: Number, required: true }
        }
      ]
    }
  });
  // Create the Admin model
  const Employee = User.discriminator('Employee', employeeSchema);

  module.exports = Employee;
