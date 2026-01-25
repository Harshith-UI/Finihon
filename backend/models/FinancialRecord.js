const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    required: true,
    enum: ['INVOICE', 'BALANCE', 'TRANSACTION'],
    uppercase: true
  },
  amount: {
    type: Number,
    required: function() {
      return this.recordType !== 'BALANCE';
    }
  },
  payee: {
    type: String,
    required: function() {
      return this.recordType === 'INVOICE';
    },
    trim: true
  },
  purpose: {
    type: String,
    required: function() {
      return this.recordType === 'INVOICE';
    },
    trim: true
  },
  dueDate: {
    type: Date,
    required: function() {
      return this.recordType === 'INVOICE';
    }
  },
  balanceAmount: {
    type: Number,
    required: function() {
      return this.recordType === 'BALANCE';
    }
  },
  fileName: {
    type: String,
    trim: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Index for efficient querying by user and type
financialRecordSchema.index({ userId: 1, recordType: 1 });
financialRecordSchema.index({ userId: 1, uploadedAt: -1 });

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);