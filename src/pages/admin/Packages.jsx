import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

function Packages() {
  const { role } = useAuth();
  const [packages, setPackages] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    features: ['', '', '']  // Array to store features
  });

  // Fetch packages from Firebase
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesCollection = collection(db, 'packages');
        const packagesSnapshot = await getDocs(packagesCollection);
        const packagesList = packagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          features: doc.data().features || [] // Ensure features is always an array
        }));
        setPackages(packagesList);
      } catch (error) {
        console.error("Error fetching packages: ", error);
        setError("Failed to load packages. Please try again later.");
      }
    };

    fetchPackages();
  }, []);

  const handleAddPackage = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewPackage({
      name: '',
      price: '',
      billingCycle: 'monthly',
      features: ['', '', '']
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    setNewPackage(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return {
        ...prev,
        features: newFeatures
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Filter out empty features
      const nonEmptyFeatures = newPackage.features.filter(feature => feature.trim() !== '');
      
      if (nonEmptyFeatures.length === 0) {
        throw new Error('Please add at least one feature');
      }

      // Add package to Firestore
      const packageData = {
        name: newPackage.name,
        price: parseFloat(newPackage.price),
        billingCycle: newPackage.billingCycle,
        features: nonEmptyFeatures,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'packages'), packageData);
      
      // Add the new package to the local state
      setPackages(prev => [...prev, { id: docRef.id, ...packageData }]);
      
      // Close modal and reset form
      handleCloseModal();
    } catch (error) {
      console.error("Error adding package: ", error);
      setError(error.message || "Failed to add package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deleteDoc(doc(db, 'packages', packageId));
        setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      } catch (error) {
        console.error("Error deleting package: ", error);
        setError("Failed to delete package. Please try again.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Packages</h1>
          {role === 'admin' && (
            <button
              onClick={handleAddPackage}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-auto min-w-[120px]"
            >
              Add Package
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{pkg.name}</h2>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">₹{pkg.price}</span>
                  <span className="text-gray-500 ml-2">/{pkg.billingCycle}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {Array.isArray(pkg.features) && pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No packages available. Click "Add Package" to create one.
          </div>
        )}

        {/* Add Package Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Package</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Package Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newPackage.name}
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
                    value={newPackage.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    name="billingCycle"
                    value={newPackage.billingCycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Features (up to 3)
                  </label>
                  {newPackage.features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                  ))}
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
    </div>
  );
}

export default Packages; 