import { Transaction, Employee } from "../models/Employee.js";

export const addTransaction = async (req, res) => {
    const { employeeId, transferAmount, Date, UtrNo, SenderName, reason } = req.body;

  // Check if the employee ID is valid
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

    try {
      // Create a new transaction record
      const newTransaction = new Transaction({
        employeeId,
        transferAmount,
        Date,
        UtrNo,
        SenderName,
        reason
      });
  
      // Save the transaction to the database
      await newTransaction.save();
  
      res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate UTR number error
        return res.status(400).json({ error: 'Transaction with this UTR number already exists' });
      }
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Server error. Could not add transaction.' });
    }
  };
  
  // Get all transactions
//  export const getTransactions = async (req, res) => {
//     try {
//       const transactions = await Transaction.find().sort({ createdAt: -1 }); // Sort by most recent
//       res.status(200).json({data: transactions});
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       res.status(500).json({ error: 'Server error. Could not fetch transactions.' });
//     }
//   };

export const getTransactions = async (req, res) => {
  try {
    // Fetch transactions and populate employee details
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .populate({
        path: 'employeeId',
        select: 'personalDetails.phoneNumber personalDetails.name companyDetails.employeeId',
      });

    // Format the transactions data to include employee details
    const formattedTransactions = transactions.map(transaction => {
      // Check if employeeId is populated
      const employee = transaction.employeeId || {}; // Handle cases where employeeId is not populated

      // Extract employee details with default values
      const employeeDetails = employee.personalDetails || {};
      const companyDetails = employee.companyDetails || {};

      return {
        ...transaction._doc,
        employeeDetails: {
          name: employeeDetails.name || 'Unknown', // Default to 'Unknown' if name is missing
          phoneNumber: employeeDetails.phoneNumber || 'Unknown', // Default to 'Unknown' if phone number is missing
          employeeId: companyDetails.employeeId || 'Unknown', // Default to 'Unknown' if employee ID is missing
        }
      };
    });

    res.status(200).json({ data: formattedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error. Could not fetch transactions.' });
  }
};

  export const getTransactionsByEmployeeId = async (req, res) => {
    
    try {
      const { employeeId } = req.params;
      if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

      const transactions = await Transaction.find({ employeeId }).sort({ createdAt: -1 }); // Sort by createdAt in descending order (-1);
    return  res.status(200).json({message: "transaction data", data: transactions});
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Server error. Could not fetch transactions.' });
    }
  };
  

  export const updateTransactionStatus = async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.params);
      const { transactionId } = req.params; // Read transactionId from URL params
      const { status } = req.body; // status should be 'verified', 'cancelled', or 'pending'
      
      if (!['pending', 'verified', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        { status },
        { new: true }
      );
  
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
        console.log('transaction not found but why'); 
      }
  
      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      console.log('error is', error);
      res.status(500).json({ message: 'Server error' });
    }
  };