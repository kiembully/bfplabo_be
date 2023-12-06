const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  typeOfService: { type: String, required: true },
  otherTypeOfService: { type: String },
  subject: { type: String, required: true },
  totalPage: { type: Number, required: true },
  topic: { type: String, required: true },
  details: { type: String, required: true },
  sources: { type: Number, required: true },
  academicLevel: { type: Number, required: true },
  formatStyle: { type: Number, required: true },
  paperType: { type: Number, required: true },
  spacing: { type: Number, required: true },
  otherSpacing: { type: String },
  optionalNeeds: {
    chart: { type: Boolean, required: true },
    plagiarism: { type: Boolean, required: true },
    abstract: { type: Boolean, required: true }
  },
  clientFiles: [
    {
      originalName: { type: String },
      path: { type: String },
    }
  ],
  writerFiles: [
    {
      originalName: { type: String },
      path: { type: String },
    }
  ],
  totalChart: { type: Number, required: true },
  timezone: { type: Number, required: true },
  deadline: { type: String, required: true },
  deadlineInPh: { type: String, required: true },
  orderStatus: { type: String, required: true },
  writer: { type: String },
  isFullyPaid: { type: Boolean, required: true },
  discount: { type: Number },
  coupon: { type: String },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  transactionLog: [
    {
      timestamp: { type: String },
      action: { type: String },
      status: { type: String },
      paymentStatus: { type: Boolean },
      writer: { type: String },
      price: { type: Number },
      operatedBy: { type: String }
    }
  ],
  paymentDetails: [
    {
      timestamp: { type: String },
      orderId: { type: String },
      transactionId: { type: String },
      bank: { type: String },
      paymentType: { type: Number },
      amount: { type: Number },
      balance: { type: Number },
      invoiceUrl: { type: String },
      paymentStatus: { type: Number }
    }
  ]
})

module.exports = mongoose.model('Order', orderSchema);