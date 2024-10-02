import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    personalDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String },
        photo: { type: String }, // URL or path to the photo
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      },
      // remove the unique employeeId field
      companyDetails: {
        employeeId: { type: String, required: true },
        department: { type: String, required: true },
        dateOfJoining: { type: Date },
        status: { type: String, enum: ['Active', 'Inactive'], required: true },

      },
      financialDetails: {
        basicSalary: { type: Number, required: true },
        bankName: { type: String },
        bankBranch: { type: String },
        ifscCode: { type: String },
        bankAccountNumber: { type: String },
        upiId: { type: String },
        cashOptions: { type: Boolean }, // Indicates if cash payment is an option
      }
    });

    const vehicleMoveDataSchema = new mongoose.Schema({
      villageNameStart: String,
      goingVillage: String,
      startReading: Number,
      endReading: Number,
      totalKM: Number,
      purpose: String,
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Add this line
      isEditable: {
        type: Boolean,
        default: true, // Mark it editable by default
      },
    }, { timestamps: true });


    const transactionSchema = new mongoose.Schema({
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
      transferAmount: {
        type: Number,
        required: true,
      },
      Date: {
        type: Date,
        required: true,
      },
      UtrNo: {
        type: String,
        required: true,
        unique: true, // Ensure that UTR number is unique
      },
      SenderName: {
        type: String,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'verified', 'cancelled'], // Enum for allowed statuses
        default: 'pending', // Default status is pending
      },
    }, { timestamps: true });
    

    const Employee = mongoose.model('Employee', EmployeeSchema);
    const VehicleMoveData = mongoose.model('VehicleMoveData', vehicleMoveDataSchema);
    const Transaction = mongoose.model('Transaction', transactionSchema);

    export {Employee, VehicleMoveData, Transaction};