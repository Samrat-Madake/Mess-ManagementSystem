import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import ReviewCard from '../../components/ReviewCard';

function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: '',
  });

  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(collection(db, 'reviews'), orderBy('date', 'desc'));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewsList = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
        setError("Failed to load reviews. Please try again later.");
      }
    };

    fetchReviews();
  }, []);

  const handleAddReview = () => {
    setEditingReview(null);
    setNewReview({ rating: 5, review: '' });
    setShowAddModal(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      review: review.review,
    });
    setShowAddModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      } catch (error) {
        console.error("Error deleting review: ", error);
        setError("Failed to delete review. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const reviewData = {
        userId: user.uid,
        userName: user.email.split('@')[0],
        rating: parseInt(newReview.rating),
        review: newReview.review,
        date: new Date().toISOString(),
        likes: 0,
        comments: 0
      };

      if (editingReview) {
        // Update existing review
        await updateDoc(doc(db, 'reviews', editingReview.id), reviewData);
        setReviews(prev => prev.map(review => 
          review.id === editingReview.id ? { ...reviewData, id: review.id } : review
        ));
      } else {
        // Add new review
        const docRef = await addDoc(collection(db, 'reviews'), reviewData);
        setReviews(prev => [{ id: docRef.id, ...reviewData }, ...prev]);
      }

      setShowAddModal(false);
      setNewReview({ rating: 5, review: '' });
      setEditingReview(null);
    } catch (error) {
      console.error("Error saving review: ", error);
      setError("Failed to save review. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Reviews</h1>
          <button
            onClick={handleAddReview}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-auto min-w-[150px]"
          >
            Submit Your Review
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>

        {/* Add/Edit Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingReview ? 'Edit Your Review' : 'Submit Your Review'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={newReview.review}
                    onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingReview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {reviews.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews; 