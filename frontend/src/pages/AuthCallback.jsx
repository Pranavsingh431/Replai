import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed');
          setTimeout(() => navigate('/app/login'), 2000);
          return;
        }

        if (session) {
          // Session exists, user is authenticated
          console.log('User authenticated:', session.user.email);
          navigate('/dashboard');
        } else {
          // No session, redirect to login
          console.log('No session found');
          navigate('/app/login');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Something went wrong');
        setTimeout(() => navigate('/app/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-rose-300 border-t-rose-600 mx-auto"></div>
            <p className="text-gray-600">Signing you in...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallback;
