import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await login(formData.email, formData.password);
      
      // Redirect to the page they tried to visit or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/applya-logo.svg" alt="Applya" className="w-10 h-10 brightness-0 invert" />
            <span className="text-2xl font-bold text-white">Applya</span>
          </Link>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Track your job applications<br />with confidence.
          </h1>
          <p className="text-purple-100 text-lg mb-8">
            Join thousands of job seekers who've organized their search and landed their dream jobs.
          </p>
          
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-white">10k+</p>
              <p className="text-purple-200 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50k+</p>
              <p className="text-purple-200 text-sm">Jobs Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">85%</p>
              <p className="text-purple-200 text-sm">Success Rate</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-purple-200 text-sm">
            © 2025 Applya. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <img src="/images/applya-logo.svg" alt="Applya" className="w-8 h-8" />
            <span className="text-xl font-bold text-slate-800">Applya</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to continue to your dashboard</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-700 hover:bg-purple-800 shadow-lg shadow-purple-200 hover:shadow-purple-300'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button 
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Facebook</span>
            </button>
          </div>

          <p className="text-center mt-8 text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;