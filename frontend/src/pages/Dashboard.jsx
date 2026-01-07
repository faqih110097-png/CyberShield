import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Here's an overview of your security testing activities.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Reports</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats?.totalReports || 0}</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Flagged Reports</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">{stats?.flaggedReports || 0}</p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Vulnerability Types</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats?.vulnerabilityStats?.length || 0}
                  </p>
                </div>
                <div className="text-4xl">🔍</div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Your Role</p>
                  <p className="text-xl font-bold text-primary-400 mt-2 capitalize">
                    {user?.role || 'User'}
                  </p>
                </div>
                <div className="text-4xl">👤</div>
              </div>
            </div>
          </div>
        )}

        {/* Users List - Data Exposure Vulnerability */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">All Users</h2>
          <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-700">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-800 divide-y divide-dark-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-dark-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-red-900 text-red-200'
                                : 'bg-green-900 text-green-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/labs"
            className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors"
          >
            <h3 className="text-xl font-semibold text-white mb-2">🔬 Security Labs</h3>
            <p className="text-gray-400">
              Test and learn about various security vulnerabilities in a controlled environment.
            </p>
          </Link>

          <Link
            to="/reports"
            className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors"
          >
            <h3 className="text-xl font-semibold text-white mb-2">📈 Reports</h3>
            <p className="text-gray-400">
              View detailed reports of your security testing activities and findings.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

