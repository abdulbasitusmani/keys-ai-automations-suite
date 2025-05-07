
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Logo from '@/components/Logo';

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = location.hash;
        if (!hash) {
          setVerificationStatus('error');
          setMessage('Invalid verification link. Please try again or request a new verification email.');
          return;
        }

        // The token is in the URL fragment after the #
        // Supabase handles this automatically if we're on this page
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error('Verification error:', error);
          setVerificationStatus('error');
          setMessage('Unable to verify your email. Please try again or request a new verification link.');
        } else {
          setVerificationStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage('An unexpected error occurred during verification. Please try again later.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-block">
            <Logo size="large" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Email Verification</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">{message}</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertDescription>
                <div className="py-2">
                  <p className="font-medium">{message}</p>
                  <p className="mt-1">Redirecting you to login page...</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {verificationStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200 text-red-800">
              <AlertDescription>
                <div className="py-2">
                  <p className="font-medium">{message}</p>
                  <p className="mt-1">Please try again or contact support if the issue persists.</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 flex flex-col space-y-4">
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              Go to Login
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
