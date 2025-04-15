import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  People as PeopleIcon, 
  Restaurant as RestaurantIcon, 
  LocalOffer as PackageIcon, 
  Badge as EmployeeIcon,
  RateReview as ReviewIcon
} from '@mui/icons-material';

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    dishes: 0,
    packages: 0,
    employees: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersCount = usersSnapshot.size;
        
        // Fetch dishes count
        const dishesSnapshot = await getDocs(collection(db, 'dishes'));
        const dishesCount = dishesSnapshot.size;
        
        // Fetch packages count
        const packagesSnapshot = await getDocs(collection(db, 'packages'));
        const packagesCount = packagesSnapshot.size;
        
        // Fetch employees count
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesCount = employeesSnapshot.size;
        
        // Fetch reviews count
        const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
        const reviewsCount = reviewsSnapshot.size;
        
        setStats({
          users: usersCount,
          dishes: dishesCount,
          packages: packagesCount,
          employees: employeesCount,
          reviews: reviewsCount
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
            <div className="bg-blue-100 p-3 rounded-full">
              <PeopleIcon className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
          <p className="text-sm text-gray-500 mt-2">Registered users in the system</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
        
        {/* Dishes Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Dishes</h2>
            <div className="bg-green-100 p-3 rounded-full">
              <RestaurantIcon className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.dishes}</p>
          <p className="text-sm text-gray-500 mt-2">Available dishes in the menu</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Menu Items</span>
            </div>
          </div>
        </div>
        
        {/* Packages Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Packages</h2>
            <div className="bg-purple-100 p-3 rounded-full">
              <PackageIcon className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.packages}</p>
          <p className="text-sm text-gray-500 mt-2">Active meal packages</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Subscription Plans</span>
            </div>
          </div>
        </div>
        
        {/* Employees Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
            <div className="bg-yellow-100 p-3 rounded-full">
              <EmployeeIcon className="text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.employees}</p>
          <p className="text-sm text-gray-500 mt-2">Staff members in the system</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Team Members</span>
            </div>
          </div>
        </div>
        
        {/* Reviews Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
            <div className="bg-red-100 p-3 rounded-full">
              <ReviewIcon className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.reviews}</p>
          <p className="text-sm text-gray-500 mt-2">Customer feedback received</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">User Feedback</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Select an option from the navigation menu to manage your content.</p>
      </div>
    </div>
  );
}

export default AdminDashboard; 