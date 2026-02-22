import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/Auth/forgot-password', {
        employeeId: employeeId
      });

      if (response.data.success) {
        // Navigate to OTP verification page with employee ID and masked email
        navigate('/verify-otp', {
          state: {
            employeeId: employeeId,
            email: response.data.email,
            message: response.data.message
          }
        });
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-gray-600 mt-2">Enter your Employee ID to receive an OTP</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-blue-700 text-sm">
                We'll send a One-Time Password (OTP) to your registered email address. 
                The OTP will be valid for 10 minutes.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your Employee ID"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
