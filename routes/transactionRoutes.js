import express from 'express';
import { addTransaction, getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

// Route to create TransactionData
router.post('/add-transaction', addTransaction);

// Route to fetch all TransactionData
router.get('/transactions', getTransactions);

export default router;