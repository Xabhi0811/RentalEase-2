import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [backendStatus, setBackendStatus] = useState('unknown');
  
  const navigate = useNavigate();

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setBackendStatus(response.ok ? 'online' : 'error');
    } catch (error) {
      setBackendStatus('offline');
      console.error('Backend status check failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        // Check content type before parsing as JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text.substring(0, 100));
          throw new Error('Server returned an invalid response. Please try again.');
        }
        
        const data = await response.json();
        
        if (response.ok) {
          // Save token to localStorage or context
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
          
          // Show success message
          setApiError('Login successful! Redirecting...');
          
          // Navigate to dashboard after a brief delay
          setTimeout(() => {
            navigate('/list');
          }, 1000);
        } else {
          setApiError(data.message || 'Login failed');
        }
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          setApiError('Cannot connect to server. Please check if the backend is running.');
          setBackendStatus('offline');
        } else if (error.name === 'SyntaxError') {
          setApiError('Server error. Please try again later.');
        } else {
          setApiError(error.message || 'Network error. Please try again.');
        }
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const retryConnection = () => {
    setApiError('');
    checkBackendStatus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            User Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please sign in to your account
          </p>
        </div>
        
        {/* Connection Status Indicator */}
        <div className={`p-2 rounded text-center text-xs font-medium ${
          backendStatus === 'online' ? 'bg-green-100 text-green-800' : 
          backendStatus === 'offline' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          Backend Status: {backendStatus.toUpperCase()}
          {backendStatus === 'offline' && (
            <button 
              onClick={retryConnection}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>
        
        {apiError && (
          <div className={`px-4 py-3 rounded relative ${apiError.includes('successful') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            {apiError}
            {apiError.includes('Cannot connect') && (
              <button 
                onClick={retryConnection}
                className="ml-2 underline hover:no-underline"
              >
                Check Again
              </button>
            )}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`relative block w-full px-4 py-3 border ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out sm:text-sm`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={backendStatus === 'offline'}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`relative block w-full px-4 py-3 border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out sm:text-sm`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={backendStatus === 'offline'}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={backendStatus === 'offline'}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || backendStatus === 'offline'}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading || backendStatus === 'offline' ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : backendStatus === 'offline' ? 'Server Offline' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/user/signup" 
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Troubleshooting Connection Issues:</h3>
          <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
            <li>Ensure your backend server is running on port 4000</li>
            <li>Verify the backend URL: {import.meta.env.VITE_BACKEND_URL || 'Not set'}</li>
            <li>Check if there are any CORS issues in the browser console</li>
            <li>Try accessing the backend URL directly in your browser</li>
            <li>Restart your backend server if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;