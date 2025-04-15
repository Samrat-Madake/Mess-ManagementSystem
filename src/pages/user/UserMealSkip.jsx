import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createMealSkip, getUserMealSkips } from '../../services/mealSkipService';
import './UserMealSkip.css';

const UserMealSkip = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [skipLunch, setSkipLunch] = useState(false);
  const [skipDinner, setSkipDinner] = useState(false);
  const [mealSkips, setMealSkips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserMealSkips();
    }
  }, [user]);

  const fetchUserMealSkips = async () => {
    try {
      setLoading(true);
      const data = await getUserMealSkips(user.uid);
      setMealSkips(data);
      setError('');
    } catch (error) {
      console.error('Error fetching meal skips:', error);
      setError('Failed to fetch meal skips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (!skipLunch && !skipDinner) {
      setError('Please select at least one meal to skip');
      return;
    }

    try {
      setLoading(true);
      await createMealSkip(
        user.uid,
        user.displayName || user.email,
        selectedDate,
        skipLunch,
        skipDinner
      );
      setSuccess('Meal skip request submitted successfully');
      setSelectedDate('');
      setSkipLunch(false);
      setSkipDinner(false);
      fetchUserMealSkips();
    } catch (error) {
      console.error('Error submitting meal skip:', error);
      setError('Failed to submit meal skip request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Invalid date';
    }
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="meal-skip-container">
      <div className="meal-skip-header">
        <h1>Meal Skip Request</h1>
        <p className="subtitle">Submit your meal skip request for upcoming dates</p>
      </div>

      <div className="meal-skip-content">
        <div className="meal-skip-form-section">
          <div className="form-card">
            <h2>New Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-input"
                />
              </div>

              <div className="meal-options">
                <h3>Select Meals to Skip</h3>
                <div className="checkbox-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={skipLunch}
                      onChange={(e) => setSkipLunch(e.target.checked)}
                    />
                    <span className="checkbox-label">Lunch</span>
                  </label>

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={skipDinner}
                      onChange={(e) => setSkipDinner(e.target.checked)}
                    />
                    <span className="checkbox-label">Dinner</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠</span>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                {success}
              </div>
            )}
          </div>
        </div>

        <div className="meal-skip-history-section">
          <div className="history-card">
            <h2>Request History</h2>
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : mealSkips.length === 0 ? (
              <div className="no-records">
                <p>No meal skip requests found</p>
              </div>
            ) : (
              <div className="history-list">
                {mealSkips.map((mealSkip) => (
                  <div key={mealSkip.id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-date">{formatDate(mealSkip.date)}</span>
                      <span className={`status-badge ${getStatusColor(mealSkip.status)}`}>
                        {mealSkip.status}
                      </span>
                    </div>
                    <div className="history-item-details">
                      <span className="meals-label">Meals:</span>
                      <span className="meals-value">
                        {mealSkip.skipLunch && 'Lunch'}
                        {mealSkip.skipLunch && mealSkip.skipDinner && ' & '}
                        {mealSkip.skipDinner && 'Dinner'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMealSkip; 