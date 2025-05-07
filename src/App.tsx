
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-supabase-auth";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import NotFound from "./pages/NotFound";
import AutomationDetails from "./pages/AutomationDetails";
import Packages from "./pages/Packages";
import ConnectInstagram from "./pages/ConnectInstagram";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Support from "./pages/Support";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/support" element={<Support />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agents" 
              element={
                <ProtectedRoute>
                  <Agents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/automation/:packageId" 
              element={
                <ProtectedRoute>
                  <AutomationDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/packages" 
              element={
                <ProtectedRoute>
                  <Packages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/connect-instagram" 
              element={
                <ProtectedRoute>
                  <ConnectInstagram />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/setup/:packageId" 
              element={
                <ProtectedRoute>
                  <ConnectInstagram />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
