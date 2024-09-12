import mongoose from 'mongoose';


const MemberSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  headName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  donationAmount: {
    type: Number, // Store as number
    required: true,
  },
  rasidNo: {
    type: String,
    required: true,
  },
  familyMembers: {
    type: String,
  },
  occupation: {
    type: String,
  },
  gauwansh: {
    type: String,
  },
  tractor: {
    type: String, // yes or no
  },
  tractorCount: {
    type: Number, // Convert string to number
  },
  twoWheeler: {
    type: String,
  },
  twoWheelerCount: {
    type: Number, // Convert string to number
  },
  fourWheeler: {
    type: String,
  },
  fourWheelerCount: {
    type: Number, // Convert string to number
  },
  educationRequired: {
    type: String,
  },
  jobSearch: {
    type: String,
  },
  mahilaSamuh: {
    type: String,
  },
  mahilaSamuhCount: {
    type: Number, // Convert string to number
  },
  loanRunning: {
    type: String,
  },
  loanRunningAmount: {
    type: Number, // Convert string to number
  },
  needLoan: {
    type: String,
  },
  loanRequiredAmount: {
    type: Number, // Convert string to number
  },
  otherDetails: {
    type: String,
  },
  donationDetailsText: {
    type: String,
  },
  donationAmountInWords: {
    type: String,
  },
  remark: {
    type: String,
  }
});

const Member = mongoose.model('Member', MemberSchema);


export default Member;
