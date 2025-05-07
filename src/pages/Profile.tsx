
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Key, User, Save } from 'lucide-react';

// Form schema for profile
const profileFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Form schema for credentials
const credentialsFormSchema = z.object({
  instagram_username: z.string().optional(),
  whatsapp_api_key: z.string().optional(),
  calendar_id: z.string().optional(),
});

// Form schema for changing password
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const credentialsForm = useForm<z.infer<typeof credentialsFormSchema>>({
    resolver: zodResolver(credentialsFormSchema),
    defaultValues: {
      instagram_username: '',
      whatsapp_api_key: '',
      calendar_id: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfileData(data);
        profileForm.reset({
          email: data.email || '',
        });

        // Set credentials form values if they exist
        if (data.credentials) {
          credentialsForm.reset({
            instagram_username: data.credentials.instagram_username || '',
            whatsapp_api_key: data.credentials.whatsapp_api_key || '',
            calendar_id: data.credentials.calendar_id || '',
          });
        }

      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const onSaveProfile = async (data: z.infer<typeof profileFormSchema>) => {
    if (!user) return;

    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: data.email,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const onSaveCredentials = async (data: z.infer<typeof credentialsFormSchema>) => {
    if (!user) return;

    setSavingCredentials(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          credentials: {
            instagram_username: data.instagram_username || null,
            whatsapp_api_key: data.whatsapp_api_key || null,
            calendar_id: data.calendar_id || null,
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Credentials updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating credentials:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update credentials.',
        variant: 'destructive',
      });
    } finally {
      setSavingCredentials(false);
    }
  };

  const onChangePassword = async (data: z.infer<typeof passwordFormSchema>) => {
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password changed successfully.',
      });

      passwordForm.reset();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password.',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to log out.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600">
              Manage your account details and preferences
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label>Current Package</Label>
                      <div className="mt-1 p-3 bg-gray-100 rounded-md">
                        {profileData?.package_selected ? (
                          <div className="font-medium">
                            {profileData.package_selected === 'instagram' && 'Instagram DM Automation'}
                            {profileData.package_selected === 'whatsapp' && 'WhatsApp Reminders'}
                            {profileData.package_selected === 'bill' && 'Bill Management'}
                          </div>
                        ) : (
                          <div className="text-gray-500">No package selected</div>
                        )}
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={savingProfile} 
                      className="flex items-center space-x-2"
                    >
                      {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* API Credentials */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>API Credentials</CardTitle>
                    <CardDescription>Manage your integration keys and IDs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...credentialsForm}>
                  <form onSubmit={credentialsForm.handleSubmit(onSaveCredentials)} className="space-y-4">
                    <FormField
                      control={credentialsForm.control}
                      name="instagram_username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={credentialsForm.control}
                      name="whatsapp_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp API Key</FormLabel>
                          <FormControl>
                            <Input placeholder="whatsapp_key_123" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={credentialsForm.control}
                      name="calendar_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Calendar ID</FormLabel>
                          <FormControl>
                            <Input placeholder="calendar@group.calendar.google.com" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={savingCredentials}
                      className="flex items-center space-x-2"
                    >
                      {savingCredentials && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Save Credentials
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Key className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={changingPassword}
                      className="flex items-center space-x-2"
                    >
                      {changingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
