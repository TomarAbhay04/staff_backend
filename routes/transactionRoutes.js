    import express from 'express';
    import { addTransaction, getTransactions, getTransactionsByEmployeeId, updateTransactionStatus } from '../controllers/transactionController.js';

    const router = express.Router();

    // Route to create TransactionData
    router.post('/add-transaction', addTransaction);

    // Route to fetch all TransactionData
    router.get('/transactions', getTransactions);

    // Route to fetch TransactionData by employee ID
    router.get('/transactions/:employeeId', getTransactionsByEmployeeId);


    // Route to update TransactionData status
    router.put('/update-transaction-status/:transactionId', updateTransactionStatus);



    export default router;