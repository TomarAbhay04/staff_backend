import { Transaction } from "../models/Employee.js";

export const addTransaction = async (req, res) => {
    const { transferAmount, Date, UtrNo, SenderName, reason } = req.body;

    try {
      // Create a new transaction record
      const newTransaction = new Transaction({
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
 export const getTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find().sort({ createdAt: -1 }); // Sort by most recent
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Server error. Could not fetch transactions.' });
    }
  };
  