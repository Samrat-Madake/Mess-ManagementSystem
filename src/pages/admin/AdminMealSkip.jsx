import React, { useState, useEffect } from 'react';
import { getAllMealSkips, updateMealSkipStatus } from '../../services/mealSkipService';
import './AdminMealSkip.css';

const AdminMealSkip = () => {
  const [mealSkips, setMealSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchMealSkips();
  }, []);

  const fetchMealSkips = async () => {
    try {
      setLoading(true);
      const data = await getAllMealSkips();
      setMealSkips(data);
      setError('');
    } catch (error) {
      console.error('Error fetching meal skips:', error);
      setError('Failed to fetch meal skips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (mealSkipId, newStatus) => {
    try {
      setLoading(true);
      await updateMealSkipStatus(mealSkipId, newStatus);
      setSuccess(`Meal skip status updated to ${newStatus}`);
      
      // Update the local state
      setMealSkips(prevSkips => 
        prevSkips.map(skip => 
          skip.id === mealSkipId ? { ...skip, status: newStatus } : skip
        )
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating meal skip status:', error);
      setError('Failed to update meal skip status. Please try again.');
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

  // Sort meal skips based on date
  const sortMealSkips = (mealSkipsToSort) => {
    return [...mealSkipsToSort].sort((a, b) => {
      const dateA = a.date.toDate().getTime();
      const dateB = b.date.toDate().getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  // Filter meal skips based on status and sort by date
  const filteredAndSortedMealSkips = sortMealSkips(
    statusFilter === 'all' 
      ? mealSkips 
      : mealSkips.filter(skip => skip.status === statusFilter)
  );

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  return (
    <div className="admin-meal-skip-container">
      <h1 className="admin-meal-skip-title">Meal Skip Management</h1>

      <div className="admin-meal-skip-content">
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

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select 
              id="status-filter" 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-sort">Sort by Date:</label>
            <select
              id="date-sort"
              className="filter-select"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="table-container">
            {filteredAndSortedMealSkips.length === 0 ? (
              <div className="no-records">
                <p>No meal skips found</p>
              </div>
            ) : (
              <table className="meal-skip-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date</th>
                    <th>Meals</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedMealSkips.map((mealSkip) => (
                    <tr key={mealSkip.id}>
                      <td>{mealSkip.userName}</td>
                      <td>{formatDate(mealSkip.date)}</td>
                      <td>
                        {mealSkip.skipLunch && 'Lunch'}
                        {mealSkip.skipLunch && mealSkip.skipDinner && ' & '}
                        {mealSkip.skipDinner && 'Dinner'}
                      </td>
                      <td>
                        <span className={`status-badge status-${mealSkip.status}`}>
                          {mealSkip.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {mealSkip.status === 'pending' && (
                            <>
                              <button 
                                className="action-button approve"
                                onClick={() => handleStatusUpdate(mealSkip.id, 'approved')}
                              >
                                Approve
                              </button>
                              <button 
                                className="action-button reject"
                                onClick={() => handleStatusUpdate(mealSkip.id, 'rejected')}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMealSkip; 