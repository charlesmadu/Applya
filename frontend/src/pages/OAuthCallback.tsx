import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (token) {
        // Save token
        localStorage.setItem('token', token);
        
        // Fetch user info
        try {
          const user = await authAPI.getMe();
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to fetch user:', error);
          navigate('/login');
        }
      } else {
        // No token, redirect to login
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
        <p className="text-slate-500">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;