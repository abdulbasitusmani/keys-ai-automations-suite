
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import Home from './Home';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    if (user) {
      // If user is logged in, redirect to dashboard
      navigate('/dashboard', { replace: true });
    } 
    // No else here - if not logged in, stay on the home page
  }, [navigate, user]);
  
  // Return Home as a fallback
  return <Home />;
};

export default Index;
