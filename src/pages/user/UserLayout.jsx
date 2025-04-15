import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as PackageIcon,
  RateReview as ReviewIcon,
  Announcement as AnnouncementIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Extract name from email when component mounts
    const email = auth.currentUser?.email;
    if (email) {
      const name = email.split('@')[0];
      // Capitalize first letter of each word
      const formattedName = name
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      setUserName(formattedName);
    }
  }, []);

  // Update active item when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/user') return setActiveItem('dashboard');
    if (path.includes('/user/dishes')) return setActiveItem('dishes');
    if (path.includes('/user/packages')) return setActiveItem('packages');
    if (path.includes('/user/reviews')) return setActiveItem('reviews');
    if (path.includes('/user/announcements')) return setActiveItem('announcements');
    if (path.includes('/user/meal-skip')) return setActiveItem('meal-skip');
    if (path.includes('/user/payment')) return setActiveItem('payment');
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/user', icon: <DashboardIcon /> },
    { id: 'dishes', label: 'View Dishes', path: '/user/dishes', icon: <RestaurantIcon /> },
    { id: 'packages', label: 'View Packages', path: '/user/packages', icon: <PackageIcon /> },
    { id: 'reviews', label: 'Reviews', path: '/user/reviews', icon: <ReviewIcon /> },
    { id: 'announcements', label: 'Announcements', path: '/user/announcements', icon: <AnnouncementIcon /> },
    { id: 'meal-skip', label: 'Meal Skip', path: '/user/meal-skip', icon: <EventNoteIcon /> },
    { id: 'payment', label: 'Payment', path: '/user/payment', icon: <PaymentIcon /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          
          {userName && (
            <p className="mt-2 text-2xl text-gray-900 font-bold">
              Welcome {userName}
            </p>
          )}
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeItem === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveItem(item.id)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors w-auto min-w-[100px]"
            >
              <LogoutIcon className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout; 