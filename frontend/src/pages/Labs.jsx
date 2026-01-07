import { useEffect, useState } from 'react';
import api from '../api/axios';

const Labs = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState({});
  const [testInputs, setTestInputs] = useState({});

  useEffect(() => {
    fetchVulnerabilities();
  }, []);

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

  const handleTest = async (vulnName, endpoint, inputData = {}) => {
    try {
      setTestResults({ ...testResults, [vulnName]: { loading: true } });

      let response;
      if (endpoint === 'auth-weakness') {
        response = await api.post('/labs/auth-weakness', inputData);
      } else if (endpoint === 'input-validation') {
        response = await api.post('/labs/input-validation', inputData);
      } else if (endpoint === 'access-control') {
        response = await api.get('/labs/access-control');
      } else if (endpoint === 'session-handling') {
        response = await api.post('/labs/session-handling', inputData);
      }

      setTestResults({
        ...testResults,
        [vulnName]: { ...response.data, loading: false },
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        [vulnName]: {
          success: false,
          message: error.response?.data?.message || 'Test failed',
          loading: false,
        },
      });
    }
  };

  const getEndpoint = (name) => {
    const nameMap = {
      'Authentication Weakness': 'auth-weakness',
      'Input Validation': 'input-validation',
      'Access Control': 'access-control',
      'Session Handling': 'session-handling',
    };
    return nameMap[name] || '';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-green-600',
      Medium: 'bg-yellow-600',
      High: 'bg-orange-600',
      Critical: 'bg-red-600',
    };
    return colors[severity] || 'bg-gray-600';
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
          <h1 className="text-4xl font-bold text-white mb-4">Security Testing Labs</h1>
          <p className="text-gray-400">
            Test and learn about various security vulnerabilities in a controlled, safe environment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vulnerabilities.map((vuln) => {
            const endpoint = getEndpoint(vuln.name);
            const result = testResults[vuln.name] || {};
            const input = testInputs[vuln.name] || {};

            return (
              <div
                key={vuln._id}
                className="bg-dark-800 rounded-lg p-6 border border-dark-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{vuln.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{vuln.description}</p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${getSeverityColor(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          vuln.enabled
                            ? 'bg-green-900 text-green-200'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {vuln.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {!vuln.enabled && (
                  <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded mb-4 text-sm">
                    This lab is currently disabled. Contact an admin to enable it.
                  </div>
                )}

                {vuln.enabled && (
                  <div className="space-y-4">
                    {endpoint === 'auth-weakness' && (
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white mb-2"
                          value={input.email || ''}
                          onChange={(e) =>
                            setTestInputs({
                              ...testInputs,
                              [vuln.name]: { ...input, email: e.target.value },
                            })
                          }
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
                          value={input.password || ''}
                          onChange={(e) =>
                            setTestInputs({
                              ...testInputs,
                              [vuln.name]: { ...input, password: e.target.value },
                            })
                          }
                        />
                      </div>
                    )}

                    {endpoint === 'input-validation' && (
                      <input
                        type="text"
                        placeholder="Enter input to test"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
                        value={input.input || ''}
                        onChange={(e) =>
                          setTestInputs({
                            ...testInputs,
                            [vuln.name]: { input: e.target.value },
                          })
                        }
                      />
                    )}

                    {endpoint === 'session-handling' && (
                      <input
                        type="text"
                        placeholder="Action (e.g., login, logout)"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
                        value={input.action || ''}
                        onChange={(e) =>
                          setTestInputs({
                            ...testInputs,
                            [vuln.name]: { action: e.target.value },
                          })
                        }
                      />
                    )}

                    <button
                      onClick={() => handleTest(vuln.name, endpoint, input)}
                      disabled={result.loading}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                    >
                      {result.loading ? 'Testing...' : 'Run Test'}
                    </button>

                    {result.message && (
                      <div
                        className={`p-4 rounded ${
                          result.success
                            ? 'bg-green-900 border border-green-700 text-green-200'
                            : 'bg-red-900 border border-red-700 text-red-200'
                        }`}
                      >
                        <p className="font-medium">{result.message}</p>
                        {result.riskLevel && (
                          <p className="text-sm mt-2">Risk Level: {result.riskLevel}</p>
                        )}
                        {result.output && <p className="text-sm mt-2">{result.output}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Labs;

