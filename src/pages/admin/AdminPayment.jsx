import { useState, useEffect } from 'react';
import { getAllPayments, updatePaymentStatus } from '../../services/paymentService';
import './AdminPayment.css';

export default function AdminPayment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const fetchedPayments = await getAllPayments();
      setPayments(fetchedPayments);
      setError('');
    } catch (err) {
      setError('Failed to fetch payments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus, remarks = '') => {
    try {
      await updatePaymentStatus(paymentId, newStatus, remarks);
      await fetchPayments();
      setSuccess(`Payment status updated to ${newStatus} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update payment status. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status.toLowerCase() === filter.toLowerCase();
  });

  const handleCloseReceipt = () => {
    setSelectedReceipt(null);
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="admin-payment-container">
      <h1>Payment Management</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {selectedReceipt && (
        <div className="receipt-popup-overlay" onClick={handleCloseReceipt}>
          <div className="receipt-popup" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseReceipt}>×</button>
            <img src={selectedReceipt} alt="Payment Receipt" className="receipt-image" />
          </div>
        </div>
      )}

      <div className="filter-container">
        <label htmlFor="status-filter">Filter by status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="payments-list">
        {filteredPayments.length === 0 ? (
          <div className="no-payments">No payments found</div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="payment-item">
              <div className="payment-header">
                <div className="user-info">
                  <strong>User:</strong> {payment.userName}
                </div>
                <span className={`payment-status ${getStatusClass(payment.status)}`}>
                  {payment.status}
                </span>
              </div>

              <div className="payment-details">
                <div className="payment-info">
                  <p><strong>Month:</strong> {payment.month}</p>
                  <p><strong>Amount:</strong> ₹{payment.amount}</p>
                  <p><strong>Submitted:</strong> {formatDate(payment.submittedAt)}</p>
                  {payment.remarks && (
                    <p className="payment-remarks">
                      <strong>Remarks:</strong> {payment.remarks}
                    </p>
                  )}
                </div>

                <div className="payment-actions">
                  <button
                    onClick={() => setSelectedReceipt(payment.receiptBase64)}
                    className="view-receipt"
                  >
                    View Receipt
                  </button>

                  {payment.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          const remarks = prompt('Enter remarks (optional):');
                          handleStatusUpdate(payment.id, 'approved', remarks);
                        }}
                        className="approve-button"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const remarks = prompt('Enter rejection reason:');
                          if (remarks) {
                            handleStatusUpdate(payment.id, 'rejected', remarks);
                          }
                        }}
                        className="reject-button"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 