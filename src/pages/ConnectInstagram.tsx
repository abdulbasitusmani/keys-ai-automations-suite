
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MessageSquare, Loader2 } from 'lucide-react';

const instagramFormSchema = z.object({
  username: z.string().min(1, 'Instagram username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type InstagramFormValues = z.infer<typeof instagramFormSchema>;

const ConnectInstagram = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const { user } = useSupabaseAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const form = useForm<InstagramFormValues>({
    resolver: zodResolver(instagramFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  // Mock validation function (in a real app, this would call an API)
  const validateInstagramCredentials = async (username: string, password: string) => {
    setIsValidating(true);
    
    try {
      // In a real-world scenario, you would validate against Instagram's API
      // This is a mock implementation that simulates a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, consider all credentials valid except specific test cases
      const isValid = username !== 'invalid_user';
      
      if (!isValid) {
        throw new Error('Invalid Instagram credentials');
      }
      
      setValidationSuccess(true);
      return true;
    } catch (error: any) {
      toast({
        title: "Validation Failed",
        description: error.message || "Could not validate Instagram credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: InstagramFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to connect Instagram",
        variant: "destructive",
      });
      return;
    }

    try {
      // First validate the credentials
      const isValid = await validateInstagramCredentials(data.username, data.password);
      
      if (!isValid) {
        return;
      }
      
      setIsSubmitting(true);
      
      // If valid, store Instagram credentials in the instagram_accounts table
      const { error } = await supabase
        .from('instagram_accounts')
        .insert({
          user_id: user.id,
          username: data.username,
          password: data.password,
          connected_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      
      toast({
        title: "Connection Successful",
        description: "Your Instagram account has been connected!",
      });
      
      // Update profile to indicate Instagram setup is complete
      await supabase
        .from('profiles')
        .update({ 
          package_selected: 'instagram',
          automation_active: true
        })
        .eq('id', user.id);
        
      // Navigate to dashboard or automation details page
      navigate(packageId ? `/automation/${packageId}` : '/dashboard');
    } catch (error: any) {
      console.error('Instagram connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 flex items-center space-x-3">
            <div className="p-3 rounded-full bg-purple-100">
              <MessageSquare className="text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Instagram Agent</h1>
              <p className="text-gray-600">
                Automate your Instagram Comments & DMs
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-700">
                <p className="font-semibold mb-2">Instagram Automation Setup</p>
                <p>
                  Connect your Instagram account to enable automatic responses to comments and direct messages.
                  This will help you engage with your audience even when you're not online.
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleConnectClick}
                  className="w-full"
                >
                  Connect Instagram Account
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/agents')}
            >
              Back to Agents
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Instagram Account</DialogTitle>
            <DialogDescription>
              Enter your Instagram credentials to connect your account.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {validationSuccess && (
                <div className="py-2 px-3 bg-green-50 border border-green-100 rounded-md text-green-700 text-sm">
                  ✓ Credentials verified successfully
                </div>
              )}
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  type="button"
                  disabled={isValidating || isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isValidating || isSubmitting}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectInstagram;
