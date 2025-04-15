import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import ViewDishes from './pages/user/ViewDishes';
import ViewPackages from './pages/user/ViewPackages';
import Reviews from './pages/user/Reviews';
import ViewReviews from './pages/admin/ViewReviews';
import ListDishes from './pages/admin/ListDishes';
import Packages from './pages/admin/Packages';
import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
import RedirectBasedOnRole from './components/RedirectBasedOnRole';
import Employees from './pages/admin/Employees';
import AdminAnnouncement from './pages/admin/AdminAnnouncement';
import UserAnnouncement from './pages/user/UserAnnouncement';
import UserMealSkip from './pages/user/UserMealSkip';
import AdminMealSkip from './pages/admin/AdminMealSkip';
import UserPayment from './pages/user/UserPayment';
import AdminPayment from './pages/admin/AdminPayment';

// Configure future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <AuthProvider>
      <Router {...routerConfig}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dishes" element={<ListDishes />} />
            <Route path="employees" element={<Employees />} />
            <Route path="packages" element={<Packages />} />
            <Route path="reviews" element={<ViewReviews />} />
            <Route path="announcements" element={<AdminAnnouncement />} />
            <Route path="meal-skip" element={<AdminMealSkip />} />
            <Route path="payment" element={<AdminPayment />} />
          </Route>
          
          {/* Protected User Routes */}
          <Route 
            path="/user" 
            element={
              <UserRoute>
                <UserLayout />
              </UserRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="dishes" element={<ViewDishes />} />
            <Route path="packages" element={<ViewPackages />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="announcements" element={<UserAnnouncement />} />
            <Route path="meal-skip" element={<UserMealSkip />} />
            <Route path="payment" element={<UserPayment />} />
          </Route>
          
          {/* Redirect based on role */}
          <Route path="/" element={<RedirectBasedOnRole />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
