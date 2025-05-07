
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  email?: string;
};

type AuthContextProps = {
  supabase: typeof supabase;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isEmailVerified: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email
        });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
        }
      });
      
      if (error) throw error;
      
      console.log("Sign up successful:", data);
      
      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email!",
          description: "We've sent you a verification link. Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your account has been created.",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error signing up",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // First check if email is verified
      const isVerified = await isEmailVerified(email);
      
      if (!isVerified) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in. Check your inbox for a verification link.",
          variant: "destructive",
        });
        throw new Error("Email not verified");
      }
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error logging in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error resetting password",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const isEmailVerified = async (email: string): Promise<boolean> => {
    try {
      // This checks if the user exists and if their email is confirmed
      const { data, error } = await supabase
        .from('auth.users')
        .select('email_confirmed_at')
        .eq('email', email)
        .single();

      if (error || !data) {
        // Use auth API as fallback if RLS prevents direct table access
        const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (authError || !authData?.user) {
          console.error("Error checking email verification:", authError || "User not found");
          return false;
        }
        
        return !!authData.user.email_confirmed_at;
      }
      
      return !!data.email_confirmed_at;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  };

  const value = {
    supabase,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isEmailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  
  return context;
};
