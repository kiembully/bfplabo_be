const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const officersSchema = new Schema({
  accountNumber: { type: String },
  itemNumber: { type: String },
  rank: { type: String },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  suffixname: { type: String },
  contactNumber: { type: String },
  dob: { type: String },
  age: { type: Number },
  maritalStatus: { type: String },
  gender: { type: String },
  religion: { type: String },
  longPay: { type: String },
  address: {
    province: { type: String },
    city: { type: String },
    brgy: { type: String },
    street: { type: String },
    block: { type: String },
    lot: { type: String }
  },
  benefits: {
    tin: { type: String },
    pagibig: { type: String },
    gsis: { type: String },
    philhealth: { type: String },
  },
  school: {
    tertiary: { type: String },
    attended: { type: String },
    postGradute: { type: String },
    postGraduateSchool: { type: String }
  },
  serviceDetails: {
    highestEligibility: { type: String },
    highestTraining: { type: String },
    specializedTraining: { type: String },
    dateEnteredGovernmentService: { type: String },
    dateEnteredFireService: { type: String },
    serviceYears: { type: Number },
    commissionDate: { type: String },
    comissionMode: { type: String }, // 0 - lateral, 1 - pnpa, 2 - rose from ranks, 3 - other specify
    modeOfEntry: { type: String },
    lastPromotionDate: { type: String },
    yearsInRecentRank: { type: String },
    appointmentStatus: { type: String },
    unitCode: { type: String },
    unitAssignment: { type: String },
    mainDesignation: { type: String },
    orderNumber: { type: String },
    concurrentDesignation: { type: String }
  },
  status: { type: Number } // 0 - active, 1 - inactive, 2 - resigned, 3 - retired
})

module.exports = mongoose.model('Officer', officersSchema);