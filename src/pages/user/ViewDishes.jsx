import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

function ViewDishes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState('');

  // Fetch dishes from Firebase
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishesCollection = collection(db, 'dishes');
        const dishesSnapshot = await getDocs(dishesCollection);
        const dishesList = dishesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDishes(dishesList);
      } catch (error) {
        console.error("Error fetching dishes: ", error);
        setError("Failed to load dishes. Please try again later.");
      }
    };

    fetchDishes();
  }, []);

  // Filter dishes based on search query
  const filteredDishes = dishes.filter(dish => 
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Available Dishes</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map(dish => (
            <div key={dish.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {dish.imageBase64 && (
                <img
                  src={dish.imageBase64}
                  alt={dish.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{dish.name}</h3>
                <p className="text-gray-600">₹{dish.price}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredDishes.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No dishes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewDishes; 