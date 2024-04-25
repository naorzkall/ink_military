const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date
}, { discriminatorKey: 'user_type' });  // This is your discriminator key, it could be anything
// Create the Admin model
const User = mongoose.model('User', userSchema);

// Define the student schema with additional admin property
const studentSchema = new Schema({
  nationalNumber:{
    type:String,
    required:true,
    minlength: 11,
    maxlength: 11,
    match: /^[0-9]+$/ 
  },
  militaryNumber:{
    type:String,
    required:true,
    minlength: 4,
    maxlength: 4,
    match: /^[0-9]+$/
  },
  birthdate:  {
    type: Date,
    required: true
  },
  division: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  delayedTo:{
    type: Date,
    required: true
  },
  phoneNumber:{
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    match: /^[0-9]+$/ 
  },
  balance: {
    type: Number,
    required: true
  }
});
const Student = User.discriminator('Student', studentSchema);

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

module.exports = mongoose.model('User', userSchema);


// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   resetToken: String,
//   resetTokenExpiration: Date,
  // cart: {
  //   items: [
  //     {
  //       productId: {
  //         type: Schema.Types.ObjectId,
  //         ref: 'Product',
  //         required: true
  //       },
  //       quantity: { type: Number, required: true }
  //     }
  //   ]
  // }
// });

// userSchema.methods.addToCart = function(product) {
//   const cartProductIndex = this.cart.items.findIndex(cp => {
//     return cp.productId.toString() === product._id.toString();
//   });
//   let newQuantity = 1;
//   const updatedCartItems = [...this.cart.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   } else {
//     updatedCartItems.push({
//       productId: product._id,
//       quantity: newQuantity
//     });
//   }
//   const updatedCart = {
//     items: updatedCartItems
//   };
//   this.cart = updatedCart;
//   return this.save();
// };

// userSchema.methods.removeFromCart = function(productId) {
//   const updatedCartItems = this.cart.items.filter(item => {
//     return item.productId.toString() !== productId.toString();
//   });
//   this.cart.items = updatedCartItems;
//   return this.save();
// };

// userSchema.methods.clearCart = function() {
//   this.cart = { items: [] };
//   return this.save();
// };

// module.exports = mongoose.model('User', userSchema);
