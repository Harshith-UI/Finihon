import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, CheckCircle, XCircle, Loader, Wallet } from 'lucide-react';

const BalanceEntry = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [lastBalance, setLastBalance] = useState(null);

  const handleChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setBalance(val);
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!balance || parseFloat(balance) < 0) {
      setStatus({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      await axios.post(
        'https://n8n.manifestingpodcasts.site/webhook/name,balance',
        {
          action: 'manual_balance',
          userId: user?.name || 'Unknown',
          availableAmount: parseFloat(balance),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLastBalance(parseFloat(balance));
      setStatus({ type: 'success', message: 'Balance updated!' });
      setBalance('');
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update balance.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card balance-card">
      <div className="card-top-bar">
        <div className="card-top-left">
          <Wallet size={18} className="card-icon-accent" />
          <h3>Balance</h3>
        </div>
      </div>
      <div className="card-body">
        {lastBalance !== null && (
          <div className="balance-display">
            <span className="balance-label">Current Balance</span>
            <div className="balance-amount">
              <DollarSign size={22} />
              <span>{lastBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="balance-form">
          <div className="form-group">
            <label htmlFor="balance" className="form-label">Update Balance</label>
            <div className="input-wrap">
              <DollarSign size={15} className="input-icon" />
              <input
                type="text"
                id="balance"
                value={balance}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input"
                disabled={submitting}
                required
              />
            </div>
          </div>

          {status && (
            <div className={`status-msg ${status.type}`}>
              {status.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
              <span>{status.message}</span>
            </div>
          )}

          <button type="submit" className="action-btn" disabled={submitting || !balance}>
            {submitting ? (
              <><Loader className="spin" size={15} /> Updating...</>
            ) : (
              <><DollarSign size={15} /> Update Balance</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BalanceEntry;
