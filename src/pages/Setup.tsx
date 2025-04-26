import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Clock, FileText } from 'lucide-react';

type PackageType = 'instagram' | 'whatsapp' | 'bill';

// Package-specific form schemas
const instagramSchema = z.object({});

const whatsappSchema = z.object({
  whatsapp_api_key: z.string().min(1, 'WhatsApp API key is required'),
  google_calendar_id: z.string().min(1, 'Google Calendar ID is required')
});

const billSchema = z.object({
  google_calendar_id: z.string().min(1, 'Google Calendar ID is required')
});

// Maps to help with package-specific data
const packageDetails: Record<PackageType, {
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  webhookUrl: string;
  schema: any;
}> = {
  instagram: {
    name: 'Instagram DM Automation',
    icon: MessageSquare,
    color: 'text-purple-500',
    webhookUrl: 'https://your-n8n-instance/webhook/instagram',
    schema: instagramSchema
  },
  whatsapp: {
    name: 'WhatsApp Reminders',
    icon: Clock,
    color: 'text-green-500',
    webhookUrl: 'https://your-n8n-instance/webhook/whatsapp',
    schema: whatsappSchema
  },
  bill: {
    name: 'Bill Management',
    icon: FileText,
    color: 'text-blue-500',
    webhookUrl: 'https://your-n8n-instance/webhook/bill',
    schema: billSchema
  }
};

const Setup = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { user, supabase } = useSupabaseAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isActivatingAutomation, setIsActivatingAutomation] = React.useState(false);
  
  // Cast packageId to PackageType
  const packageType = (packageId as PackageType) || 'instagram';
  
  // Ensure packageId is valid
  React.useEffect(() => {
    if (!packageId || !['instagram', 'whatsapp', 'bill'].includes(packageId)) {
      navigate('/packages');
    }
    if (!user) {
      navigate('/login');
    }
  }, [packageId, user, navigate]);
  
  const packageInfo = packageDetails[packageType];
  
  const form = useForm({
    resolver: zodResolver(packageInfo.schema),
    defaultValues: packageType === 'instagram' ? {} : 
                   packageType === 'whatsapp' ? {
                     whatsapp_api_key: '',
                     google_calendar_id: ''
                   } : {
                     google_calendar_id: ''
                   }
  });
  
  const handleInstagramAuth = async () => {
    // This would be the Instagram OAuth flow
    toast({
      title: "Instagram OAuth",
      description: "A real implementation would redirect to Instagram's OAuth flow here",
    });
    
    // Mock a successful OAuth for demo
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Instagram account connected successfully (mock)",
      });
    }, 1000);
  };
  
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to set up automation",
          variant: "destructive",
        });
        return;
      }
      
      // Store credentials in Supabase
      const credentials = {
        ...(packageType === 'instagram' && {
          access_token: 'mock-instagram-token',  // In a real app, this would come from OAuth
          instagram_account_id: 'mock-instagram-account-id'
        }),
        ...(packageType === 'whatsapp' && {
          whatsapp_api_key: data.whatsapp_api_key,
          google_calendar_id: data.google_calendar_id
        }),
        ...(packageType === 'bill' && {
          google_calendar_id: data.google_calendar_id
        }),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          package_selected: packageType,
          credentials: credentials,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your credentials have been saved successfully",
      });
      
      // Proceed to activation step
      navigate(`/activate/${packageType}`);
      
    } catch (error: any) {
      console.error('Setup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 flex items-center space-x-3">
            <div className={`p-3 rounded-full bg-${packageType === 'instagram' ? 'purple' : packageType === 'whatsapp' ? 'green' : 'blue'}-100`}>
              <packageInfo.icon className={packageInfo.color} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Set Up {packageInfo.name}</h1>
              <p className="text-gray-600">
                Enter your credentials to get started with automation
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {packageType === 'instagram' ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-700">
                  <p className="font-semibold mb-2">Instagram DM Automation Setup</p>
                  <p>
                    To set up Instagram DM automation, you'll need to connect your Instagram Business account.
                    Click the button below to authenticate with Instagram.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleInstagramAuth}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Connect Instagram Account
                  </Button>
                  
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Continue to Activation"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {packageType === 'whatsapp' && (
                    <FormField
                      control={form.control}
                      name="whatsapp_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp API Key</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your WhatsApp API key"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can find this in your WhatsApp Business account settings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {(packageType === 'whatsapp' || packageType === 'bill') && (
                    <FormField
                      control={form.control}
                      name="google_calendar_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Calendar ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@group.calendar.google.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The calendar ID for the Google Calendar you want to use
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Credentials & Continue"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/packages')}
            >
              Back to Packages
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;
