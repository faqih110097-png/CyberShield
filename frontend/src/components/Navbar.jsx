import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-400">🛡️ CyberShield Lab</span>
            </Link>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-primary-400"
                >
                  Dashboard
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-primary-400"
                >
                  Services
                </Link>
                <Link
                  to="/labs"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-primary-400"
                >
                  Labs
                </Link>
                <Link
                  to="/reports"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-primary-400"
                >
                  Reports
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-primary-400"
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

