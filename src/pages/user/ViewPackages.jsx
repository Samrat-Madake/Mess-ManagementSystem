import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ViewPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'packages'));
        const packagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackages(packagesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch packages. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Available Packages
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-grow">
              <h2 className="text-xl font-bold mb-2">
                {pkg.name}
              </h2>
              <p className="text-blue-600 text-lg font-semibold mb-3">
                ₹{pkg.price}
              </p>
              <p className="text-gray-700 mb-4">
                {pkg.description}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Duration: {pkg.duration} days
              </p>
              
              {/* Package Features */}
              {pkg.features && pkg.features.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Package Features:
                  </h3>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              No packages available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPackages; 