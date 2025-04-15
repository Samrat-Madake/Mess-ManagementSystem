import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as PackageIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  Announcement as AnnouncementIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');

  // Update active item when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') return setActiveItem('dashboard');
    if (path.includes('/admin/dishes')) return setActiveItem('dishes');
    if (path.includes('/admin/packages')) return setActiveItem('packages');
    if (path.includes('/admin/employees')) return setActiveItem('employees');
    if (path.includes('/admin/reviews')) return setActiveItem('reviews');
    if (path.includes('/admin/announcements')) return setActiveItem('announcements');
    if (path.includes('/admin/meal-skip')) return setActiveItem('meal-skip');
    if (path.includes('/admin/payment')) return setActiveItem('payment');
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
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { id: 'dishes', label: 'List Dishes', path: '/admin/dishes', icon: <RestaurantIcon /> },
    { id: 'packages', label: 'Packages', path: '/admin/packages', icon: <PackageIcon /> },
    { id: 'employees', label: 'Employees', path: '/admin/employees', icon: <PeopleIcon /> },
    { id: 'reviews', label: 'View Reviews', path: '/admin/reviews', icon: <ReviewIcon /> },
    { id: 'announcements', label: 'Announcements', path: '/admin/announcements', icon: <AnnouncementIcon /> },
    { id: 'meal-skip', label: 'Meal Skip', path: '/admin/meal-skip', icon: <EventNoteIcon /> },
    { id: 'payment', label: 'Payments', path: '/admin/payment', icon: <PaymentIcon /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
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
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors w-auto"
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

export default AdminLayout; 