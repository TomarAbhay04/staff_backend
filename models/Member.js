import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  headName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  donationAmount: {
    type: Number,
    required: true
  },
  rasidNo: {
    type: String,
    required: true,
    trim: true
  },
  familyMembers: {
    type: Number
  },
  occupation: {
    type: String,
    trim: true
  },
  gauwansh: {
    type: Number
  },
  tractor: {
    type: String,
    enum: ['yes', 'no']
  },
  twoWheeler: {
    type: String,
    enum: ['yes', 'no']
  },
  fourWheeler: {
    type: String,
    enum: ['yes', 'no']
  },
  educationRequired: {
    type: String,
    enum: ['yes', 'no']
  },
  searchingJob: {
    type: String,
    enum: ['yes', 'no']
  },
  mahilaSamuh: {
    type: String,
    enum: ['yes', 'no']
  },
  loanRunning: {
    type: String,
    enum: ['yes', 'no']
  },
  needLoan: {
    type: String,
    enum: ['yes', 'no']
  },
  otherDetails: {
    type: String,
    trim: true
  },
  donationDetails: {
    type: String,
    trim: true
  },
  donationInWords: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

export default Member;
