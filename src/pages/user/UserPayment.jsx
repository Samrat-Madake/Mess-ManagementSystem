import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPayment, getUserPayments } from '../../services/paymentService';
import './UserPayment.css';

const UserPayment = () => {
  const { user } = useAuth();
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const userPayments = await getUserPayments(user.uid);
      setPayments(userPayments);
    } catch (error) {
      setError('Failed to fetch payment history');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 1MB for Base64 storage)
      if (file.size > 1024 * 1024) {
        setError("Receipt image size should be less than 1MB. Please choose a smaller image.");
        return;
      }
      
      setReceipt(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!month || !amount || !receipt) {
        throw new Error('Please fill in all fields');
      }

      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Convert receipt to Base64
      const reader = new FileReader();
      const receiptBase64 = await new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(receipt);
      });

      await createPayment(user.uid, user.displayName || user.email, month, amount, receiptBase64);
      setSuccess('Payment submitted successfully!');
      setMonth('');
      setAmount('');
      setReceipt(null);
      setImagePreview(null);
      fetchPayments();
    } catch (error) {
      setError(error.message || 'Failed to submit payment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Submission</h1>
      
      <div className="payment-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="month">Month:</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="receipt">Receipt Image (max 1MB):</label>
            <input
              type="file"
              id="receipt"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Receipt Preview" 
                  className="receipt-preview"
                />
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </form>
      </div>

      <div className="payment-history">
        <h2>Payment History</h2>
        {payments.length > 0 ? (
          <div className="payment-list">
            {payments.map((payment) => (
              <div key={payment.id} className="payment-item">
                <div className="payment-details">
                  <span className="payment-month">{payment.month}</span>
                  <span className="payment-amount">₹{payment.amount}</span>
                  <span className={`payment-status ${getStatusClass(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                {payment.remarks && (
                  <div className="payment-remarks">{payment.remarks}</div>
                )}
                <div className="payment-date">
                  Submitted: {payment.submittedAt.toDate().toLocaleDateString()}
                </div>
                {payment.receiptBase64 && (
                  <img 
                    src={payment.receiptBase64} 
                    alt="Receipt" 
                    className="receipt-image"
                    onClick={() => window.open(payment.receiptBase64, '_blank')}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-payments">No payment history found.</p>
        )}
      </div>
    </div>
  );
};

export default UserPayment; 