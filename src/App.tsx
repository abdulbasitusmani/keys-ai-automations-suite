
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-supabase-auth';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Agents from '@/pages/Agents';
import Settings from '@/pages/Settings';
import { Toaster } from '@/components/ui/toaster';
import Verify from '@/pages/Verify';
import Dashboard from '@/pages/Dashboard';
import Packages from '@/pages/Packages';
import PackageDetails from '@/pages/PackageDetails';
import Checkout from '@/pages/Checkout';
import ProtectedRoute from '@/components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/package/:packageId" element={<PackageDetails />} />
          
          {/* Protected routes */}
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout/:packageId" element={<Checkout />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
