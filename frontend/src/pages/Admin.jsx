import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { isAdmin } = useAuth();
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vulnerabilities');
  const [logFilters, setLogFilters] = useState({ date: '', ip: '', endpoint: '' });

  useEffect(() => {
    if (isAdmin) {
      fetchVulnerabilities();
      fetchAllReports();
    }
  }, [isAdmin]);

  const fetchVulnerabilities = async () => {
    try {
      const response = await api.get('/labs');
      setVulnerabilities(response.data);
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReports = async () => {
    try {
      const response = await api.get('/reports/all');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/reports/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (logFilters.date) params.append('date', logFilters.date);
      if (logFilters.ip) params.append('ip', logFilters.ip);
      if (logFilters.endpoint) params.append('endpoint', logFilters.endpoint);
      const response = await api.get(`/reports/logs?${params.toString()}`);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const toggleVulnerability = async (id) => {
    try {
      const response = await api.put(`/labs/${id}/toggle`);
      fetchVulnerabilities();
      alert(response.data.message);
    } catch (error) {
      console.error('Error toggling vulnerability:', error);
      alert('Failed to toggle vulnerability');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Manage vulnerabilities and view all reports.</p>
        </div>

        <div className="mb-6 border-b border-dark-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vulnerabilities'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Vulnerabilities
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('logs');
                fetchLogs();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Logs ({logs.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                fetchUsers();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Users ({users.length})
            </button>
          </nav>
        </div>

        {activeTab === 'vulnerabilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vulnerabilities.map((vuln) => (
              <div
                key={vuln._id}
                className="bg-dark-800 rounded-lg p-6 border border-dark-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{vuln.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{vuln.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-dark-700 text-gray-300 rounded text-xs">
                        {vuln.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${
                          vuln.severity === 'Critical'
                            ? 'bg-red-600'
                            : vuln.severity === 'High'
                            ? 'bg-orange-600'
                            : vuln.severity === 'Medium'
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                        }`}
                      >
                        {vuln.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Status:</p>
                    <span
                      className={`text-sm font-medium ${
                        vuln.enabled ? 'text-green-400' : 'text-gray-400'
                      }`}
                    >
                      {vuln.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleVulnerability(vuln._id)}
                    className={`px-4 py-2 rounded font-medium text-sm ${
                      vuln.enabled
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {vuln.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-700">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Vulnerability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Detected At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-800 divide-y divide-dark-700">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        No reports found.
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id} className="hover:bg-dark-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {report.userId?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-400">{report.userId?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {report.vulnerability}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-bold ${
                              report.riskScore >= 80
                                ? 'text-red-400'
                                : report.riskScore >= 60
                                ? 'text-orange-400'
                                : report.riskScore >= 30
                                ? 'text-yellow-400'
                                : 'text-green-400'
                            }`}
                          >
                            {report.riskScore}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.flagged
                                ? 'bg-red-900 text-red-200'
                                : 'bg-green-900 text-green-200'
                            }`}
                          >
                            {report.flagged ? 'Flagged' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(report.detectedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <div className="mb-6 flex flex-wrap gap-4">
              <input
                type="date"
                value={logFilters.date}
                onChange={(e) => setLogFilters({ ...logFilters, date: e.target.value })}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Filter by date"
              />
              <input
                type="text"
                value={logFilters.ip}
                onChange={(e) => setLogFilters({ ...logFilters, ip: e.target.value })}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Filter by IP"
              />
              <input
                type="text"
                value={logFilters.endpoint}
                onChange={(e) => setLogFilters({ ...logFilters, endpoint: e.target.value })}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Filter by endpoint"
              />
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
              >
                Apply Filters
              </button>
            </div>
            <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-700">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        Vulnerability
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        Risk Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        Flagged
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                        Detected At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-800 divide-y divide-dark-700">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                          No logs found.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log._id} className="hover:bg-dark-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {log.userId?.name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-400">{log.userId?.email || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {log.vulnerability}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {log.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {log.endpoint}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-sm font-bold ${
                                log.riskScore >= 80
                                  ? 'text-red-400'
                                  : log.riskScore >= 60
                                  ? 'text-orange-400'
                                  : log.riskScore >= 30
                                  ? 'text-yellow-400'
                                  : 'text-green-400'
                              }`}
                            >
                              {log.riskScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                log.flagged
                                  ? 'bg-red-900 text-red-200'
                                  : 'bg-green-900 text-green-200'
                              }`}
                            >
                              {log.flagged ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(log.detectedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
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
        )}
      </div>
    </div>
  );
};

export default Admin;

