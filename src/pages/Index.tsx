
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
    } else {
      // If not logged in, go to home
      navigate('/', { replace: true });
    }
  }, [navigate, user]);
  
  // Return Home as a fallback
  return <Home />;
};

export default Index;
