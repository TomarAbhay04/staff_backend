import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
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

    const Employee = mongoose.model('Employee', employeeSchema);

    export {Employee};