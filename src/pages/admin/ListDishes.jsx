import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

function ListDishes() {
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Filter dishes based on search query
  };

  const handleAddDish = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewDish({ name: '', price: '', image: null });
    setImagePreview(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 1MB for Base64 storage)
      if (file.size > 1024 * 1024) {
        setError("Image size should be less than 1MB. Please choose a smaller image.");
        return;
      }
      
      setNewDish(prev => ({
        ...prev,
        image: file
      }));
      
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
    setIsSubmitting(true);
    setError('');

    try {
      let imageBase64 = '';
      
      // Convert image to Base64 if an image was selected
      if (newDish.image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(newDish.image);
        });
      }

      // Add dish to Firestore
      const dishData = {
        name: newDish.name,
        price: parseFloat(newDish.price),
        imageBase64,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'dishes'), dishData);
      
      // Add the new dish to the local state
      setDishes(prev => [...prev, { id: docRef.id, ...dishData }]);
      
      // Close modal and reset form
      handleCloseModal();
    } catch (error) {
      console.error("Error adding dish: ", error);
      setError("Failed to add dish. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter dishes based on search query
  const filteredDishes = dishes.filter(dish => 
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List Dishes</h1>
          {role === 'admin' && (
            <button
              onClick={handleAddDish}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-auto min-w-[120px]"
            >
              Add Dish
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search dishes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {/* Display dishes list */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredDishes.map(dish => (
              <div key={dish.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                {dish.imageBase64 && (
                  <img 
                    src={dish.imageBase64} 
                    alt={dish.name} 
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-sm truncate mb-1">{dish.name}</h3>
                <p className="text-gray-600 text-sm">₹{dish.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          {filteredDishes.length === 0 && (
            <p className="text-gray-600 text-center py-4">
              {searchQuery ? 'No dishes found matching your search.' : 'No dishes available yet.'}
            </p>
          )}
        </div>
      </div>
      
      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Dish</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name of the Dish
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newDish.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="price">
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newDish.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="image">
                  Image (max 1MB)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListDishes; 