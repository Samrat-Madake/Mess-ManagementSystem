import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ReviewCard from '../../components/ReviewCard';

function ViewReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Reviews</h1>
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
              onEdit={null}
              onDelete={null}
            />
          ))}
        </div>

        {reviews.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No reviews available.
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewReviews; 