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
      companyDetails: {
        employeeId: { type: String, required: true, unique: true },
        department: { type: String, required: true },
        dateOfJoining: { type: Date },
        status: { type: String, enum: ['Active', 'Inactive'], required: true },
      },
      financialDetails: {
        basicSalary: { type: Number, required: true },
        bankAccountNumber: { type: String },
        upiId: { type: String },
        cashOptions: { type: Boolean }, // Indicates if cash payment is an option
      }
    });

    const vehicleMoveDataSchema = new mongoose.Schema({
      // empId: String,
      // name: String,
      // mobileNo: String,
      villageNameStart: String,
      goingVillage: String,
      startReading: Number,
      endReading: Number,
      totalKM: Number,
      purpose: String,
    });


    const transactionSchema = new mongoose.Schema({
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
      }
    }, { timestamps: true });
    

    const Employee = mongoose.model('Employee', EmployeeSchema);
    const VehicleMoveData = mongoose.model('VehicleMoveData', vehicleMoveDataSchema);
    const Transaction = mongoose.model('Transaction', transactionSchema);

    export {Employee, VehicleMoveData, Transaction};