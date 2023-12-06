const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  userType: { type: Number, required: true },
  dateJoined: { type: String },
  lastLoggedIn: { type: String }
  // orders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Orders' }],
  // assignedOrders: [{ type: mongoose.Types.ObjectId, required: true, ref: 'AssignedOrders' }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);