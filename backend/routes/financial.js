const express = require('express');
const auth = require('../middleware/auth');
const FinancialRecord = require('../models/FinancialRecord');

const router = express.Router();

// @route   POST /api/financial/upload-invoice
// @desc    Upload and process invoice
// @access  Private
router.post('/upload-invoice', auth, async (req, res) => {
  try {
    const { amount, payee, purpose, dueDate } = req.body;

    // Validation
    if (!amount || !payee || !purpose || !dueDate) {
      return res.status(400).json({ message: 'Please provide all required fields: amount, payee, purpose, dueDate' });
    }

    // Create financial record
    const financialRecord = new FinancialRecord({
      userId: req.user._id,
      recordType: 'INVOICE',
      amount: parseFloat(amount),
      payee,
      purpose,
      dueDate: new Date(dueDate),
      fileName: req.body.fileName || null,
      metadata: {
        source: 'invoice_upload',
        uploadedBy: req.user.username
      }
    });

    await financialRecord.save();

    res.json({
      message: 'Invoice uploaded successfully',
      record: {
        id: financialRecord._id,
        recordType: financialRecord.recordType,
        amount: financialRecord.amount,
        payee: financialRecord.payee,
        purpose: financialRecord.purpose,
        dueDate: financialRecord.dueDate,
        uploadedAt: financialRecord.uploadedAt
      }
    });

  } catch (error) {
    console.error('Upload invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/financial/upload-statement
// @desc    Upload and process bank statement
// @access  Private
router.post('/upload-statement', auth, async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: 'Please provide valid transaction data' });
    }

    // Process transactions and create financial records
    const financialRecords = transactions.map(transaction => ({
      userId: req.user._id,
      recordType: 'TRANSACTION',
      amount: parseFloat(transaction.amount),
      payee: transaction.payee || null,
      purpose: transaction.description || null,
      fileName: req.body.fileName || null,
      metadata: {
        source: 'bank_statement',
        transactionDate: transaction.date,
        uploadedBy: req.user.username,
        transactionType: transaction.type
      }
    }));

    const savedRecords = await FinancialRecord.insertMany(financialRecords);

    res.json({
      message: 'Bank statement processed successfully',
      records: savedRecords.length,
      transactions: savedRecords.map(record => ({
        id: record._id,
        amount: record.amount,
        payee: record.payee,
        purpose: record.purpose,
        uploadedAt: record.uploadedAt
      }))
    });

  } catch (error) {
    console.error('Upload statement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/financial/add-balance
// @desc    Add manual balance entry
// @access  Private
router.post('/add-balance', auth, async (req, res) => {
  try {
    const { balanceAmount } = req.body;

    if (!balanceAmount || balanceAmount < 0) {
      return res.status(400).json({ message: 'Please provide a valid balance amount' });
    }

    // Create balance record
    const financialRecord = new FinancialRecord({
      userId: req.user._id,
      recordType: 'BALANCE',
      balanceAmount: parseFloat(balanceAmount),
      metadata: {
        source: 'manual_entry',
        addedBy: req.user.username
      }
    });

    await financialRecord.save();

    res.json({
      message: 'Balance entry added successfully',
      record: {
        id: financialRecord._id,
        recordType: financialRecord.recordType,
        balanceAmount: financialRecord.balanceAmount,
        uploadedAt: financialRecord.uploadedAt
      }
    });

  } catch (error) {
    console.error('Add balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/financial/records
// @desc    Get user's financial records
// @access  Private
router.get('/records', auth, async (req, res) => {
  try {
    const { recordType, limit = 50, page = 1 } = req.query;
    
    const query = { userId: req.user._id };
    if (recordType) {
      query.recordType = recordType.toUpperCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const records = await FinancialRecord.find(query)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await FinancialRecord.countDocuments(query);

    res.json({
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/financial/summary
// @desc    Get user's financial summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    // Get latest balance
    const latestBalance = await FinancialRecord.findOne({
      userId: req.user._id,
      recordType: 'BALANCE'
    }).sort({ uploadedAt: -1 }).lean();

    // Get recent invoices
    const recentInvoices = await FinancialRecord.find({
      userId: req.user._id,
      recordType: 'INVOICE'
    }).sort({ dueDate: 1 }).limit(5).lean();

    // Get recent transactions
    const recentTransactions = await FinancialRecord.find({
      userId: req.user._id,
      recordType: 'TRANSACTION'
    }).sort({ uploadedAt: -1 }).limit(10).lean();

    // Calculate totals
    const totalInvoices = await FinancialRecord.countDocuments({
      userId: req.user._id,
      recordType: 'INVOICE'
    });

    const totalTransactions = await FinancialRecord.countDocuments({
      userId: req.user._id,
      recordType: 'TRANSACTION'
    });

    res.json({
      summary: {
        currentBalance: latestBalance ? latestBalance.balanceAmount : 0,
        totalInvoices,
        totalTransactions,
        recentActivity: {
          invoices: recentInvoices,
          transactions: recentTransactions
        }
      }
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;