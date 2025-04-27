
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
import { MessageSquare } from 'lucide-react';

const instagramFormSchema = z.object({
  username: z.string().min(1, 'Instagram username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type InstagramFormValues = z.infer<typeof instagramFormSchema>;

const ConnectInstagram = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      setIsSubmitting(true);
      
      // Store Instagram credentials in the instagram_accounts table
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
        
      navigate('/dashboard');
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
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Connecting..." : "Connect"}
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
