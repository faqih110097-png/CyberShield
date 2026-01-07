import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            🛡️ CyberShield Lab
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            A comprehensive security testing platform for learning and demonstrating
            cybersecurity vulnerabilities in a safe, controlled environment.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-md transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-md transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-dark-800 hover:bg-dark-700 text-white font-medium px-8 py-3 rounded-md border border-dark-700 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Security Labs</h3>
              <p className="text-gray-400">
                Test and learn about various security vulnerabilities in controlled environments.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">Detailed Reports</h3>
              <p className="text-gray-400">
                Get comprehensive reports on your security testing activities and findings.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-2">Educational</h3>
              <p className="text-gray-400">
                Perfect for learning cybersecurity concepts and secure coding practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-dark-800 rounded-lg p-12 text-center border border-dark-700">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join CyberShield Lab today and start exploring security vulnerabilities in a safe,
            educational environment.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-md transition-colors"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

