// Login Modal Component for SLBFE HRM System

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Modal, Button, Input } from '../../ui';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login, forgotPassword, isLoading, error } = useAuth();
  
  const [loginMode, setLoginMode] = useState<'login' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMode === 'login') {
      try {
        await login({
          username: formData.username,
          password: formData.password,
        });
        onClose();
        
        // Get user data to determine navigation
        const userData = localStorage.getItem('slbfe_user_data');
        if (userData) {
          const user = JSON.parse(userData);
          // HR Manager uses the HR dashboard
          if (user.role === 'hr') {
            navigate('/hr-dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else if (loginMode === 'forgot') {
      try {
        await forgotPassword(formData.email);
        alert(`Password reset link sent to ${formData.email}. Please check your inbox.`);
        setLoginMode('login');
      } catch (error) {
        console.error('Forgot password failed:', error);
      }
    }
  };

  const handleClose = () => {
    onClose();
    setLoginMode('login');
    setFormData({ username: '', password: '', email: '' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={loginMode === 'login' ? 'Welcome Back' : 'Reset Password'}
      size="md"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600">
          {loginMode === 'login' 
            ? 'Sign in to access your SLBFE account'
            : 'Enter your email to reset your password'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">{loginMode === 'login' ? (
          <>
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              fullWidth
            />
            
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              fullWidth
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setLoginMode('forgot')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your registered email"
            required
            fullWidth
          />
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            variant={loginMode === 'login' ? 'primary' : 'warning'}
            fullWidth
            loading={isLoading}
          >
            {loginMode === 'login' ? 'Sign In' : 'Send Reset Link'}
          </Button>
          
          {loginMode === 'login' ? (
            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate('/create-account');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-sm text-gray-600">Remember your password? </span>
              <button
                type="button"
                onClick={() => setLoginMode('login')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;