import express from 'express';
import { addTransaction, getTransactions, getTransactionsByEmployeeId } from '../controllers/transactionController.js';

const router = express.Router();

// Route to create TransactionData
router.post('/add-transaction', addTransaction);

// Route to fetch all TransactionData
router.get('/transactions', getTransactions);

// Route to fetch TransactionData by employee ID
router.get('/transactions/:employeeId', getTransactionsByEmployeeId);



export default router;