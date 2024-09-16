import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  FamilyHeadName: { type: String, required: true },
  MobileNumber: { type: String, required: true },
  Address: { type: String, required: true },
  VillageName: { type: String },
  State: { type: String },
  City: { type: String },
  
  DonationAmount: { type: Number, default: 0 }, // Added default value

  RasidNo: { type: String },
  FamilyMembers: { type: String },
  Occupation: { type: String },
  Gauwansh: { type: String },

  Tractor: {
    type: String,
    enum: ['yes', 'no'], // Added enum for validation
  },
  tractorCount: {
    type: Number,
    default: 0, // Added default value
  },

  TwoWheeler: {
    type: String,
    enum: ['yes', 'no'], // Added enum for validation
  },
  twoWheelerCount: {
    type: Number,
    default: 0, // Added default value
  },

  FourWheeler: {
    type: String,
    enum: ['yes', 'no'], // Added enum for validation
  },
  fourWheelerCount: {
    type: Number,
    default: 0, // Added default value
  },

  EducationRequired: { type: String },
  jobSearch: { type: String },
  MahilaSamuh: { type: String },
  mahilaSamuhCount: {
    type: Number,
    default: 0, // Added default value
  },

  LoanRunning: {
    type: String,
    enum: ['yes', 'no'], // Added enum for validation
  },
  loanRunningAmount: {
    type: Number,
    default: 0, // Added default value
  },

  NeedLoan: {
    type: String,
    enum: ['yes', 'no'], // Added enum for validation
  },
  loanRequiredAmount: {
    type: Number,
    default: 0, // Added default value
  },

  OtherDetails: { type: String },
  DonationDetailsText: { type: String },
  OtherDonation: { type: String },
  Remark: { type: String }
});

const Member = mongoose.model('Member', MemberSchema);

export default Member;
