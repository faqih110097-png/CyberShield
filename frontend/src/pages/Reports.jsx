import { useEffect, useState } from 'react';
import api from '../api/axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await api.delete(`/reports/${id}`);
        fetchReports();
        setSelectedReport(null);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

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
          <h1 className="text-4xl font-bold text-white mb-4">Security Reports</h1>
          <p className="text-gray-400">View detailed reports of your security testing activities.</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <p className="text-gray-400 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white">{stats.totalReports}</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <p className="text-gray-400 text-sm">Flagged</p>
              <p className="text-2xl font-bold text-red-400">{stats.flaggedReports}</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <p className="text-gray-400 text-sm">Vulnerability Types</p>
              <p className="text-2xl font-bold text-white">{stats.vulnerabilityStats?.length || 0}</p>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <p className="text-gray-400 text-sm">Risk Distribution</p>
              <p className="text-2xl font-bold text-white">{stats.riskDistribution?.length || 0}</p>
            </div>
          </div>
        )}

        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-700">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Vulnerability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Detected At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-800 divide-y divide-dark-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No reports found. Start testing labs to generate reports.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-dark-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{report.vulnerability}</div>
                        <div className="text-sm text-gray-400">{report.endpoint}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${getRiskColor(report.riskScore)}`}>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-primary-400 hover:text-primary-300 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-lg max-w-2xl w-full p-6 border border-dark-700">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Vulnerability</p>
                  <p className="text-white font-medium">{selectedReport.vulnerability}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Risk Score</p>
                  <p className={`font-bold ${getRiskColor(selectedReport.riskScore)}`}>
                    {selectedReport.riskScore}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{selectedReport.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">IP Address</p>
                  <p className="text-white">{selectedReport.ipAddress}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Request Data</p>
                  <pre className="bg-dark-900 p-4 rounded text-sm text-gray-300 overflow-auto">
                    {JSON.stringify(selectedReport.requestData, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Detected At</p>
                  <p className="text-white">{new Date(selectedReport.detectedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

