
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Trash2, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

// Types for the admin panel
type User = {
  id: string;
  email: string;
  package_selected: string | null;
  automation_active: boolean | null;
  is_admin: boolean | null;
};

type Package = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type Automation = {
  user_id: string;
  user_email: string;
  package: string;
  workflow_id: string;
  status: boolean;
  stats: {
    executions: number;
    success_rate: number;
    last_run: string;
  };
};

// Sample data for packages (in a real app, this would come from an API)
const packages: Package[] = [
  { 
    id: 'instagram', 
    name: 'Instagram DM Automation', 
    price: 30, 
    description: 'Automate responses to Instagram DMs and comments' 
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp Reminders', 
    price: 25,
    description: 'Set up automated reminders via WhatsApp' 
  },
  { 
    id: 'bill', 
    name: 'Bill Management', 
    price: 35,
    description: 'Automated bill payment and management' 
  }
];

// Form schema for editing user
const userFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  package_selected: z.string().nullable(),
  automation_active: z.boolean().nullable()
});

// Form schema for editing package
const packageFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(1, 'Price must be positive'),
  description: z.string().min(1, 'Description is required')
});

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isLoadingAutomations, setIsLoadingAutomations] = useState<boolean>(false);
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [isEditingPackage, setIsEditingPackage] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      package_selected: null,
      automation_active: null
    }
  });

  const packageForm = useForm<z.infer<typeof packageFormSchema>>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: ''
    }
  });

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data && data.is_admin) {
          setIsAdmin(true);
          fetchUsers();
          fetchAutomations();
        } else {
          // Not an admin, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Error',
          description: 'Failed to check admin status.',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setUsers(data as User[] || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch all automations with mock n8n stats
  const fetchAutomations = async () => {
    setIsLoadingAutomations(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, package_selected, n8n_workflow_id, automation_active')
        .not('package_selected', 'is', null)
        .not('n8n_workflow_id', 'is', null);

      if (error) throw error;

      // Transform the data to include mock n8n stats
      const automationsWithStats = (data || []).map(profile => ({
        user_id: profile.id,
        user_email: profile.email || 'Unknown',
        package: profile.package_selected || 'Unknown',
        workflow_id: profile.n8n_workflow_id || 'Unknown',
        status: profile.automation_active || false,
        stats: {
          executions: Math.floor(Math.random() * 100),
          success_rate: Math.floor(Math.random() * 100),
          last_run: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString()
        }
      }));

      setAutomations(automationsWithStats);
    } catch (error: any) {
      console.error('Error fetching automations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load automations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAutomations(false);
    }
  };

  // Handle editing a user
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    userForm.reset({
      email: user.email,
      package_selected: user.package_selected,
      automation_active: user.automation_active
    });
    setIsEditingUser(true);
  };

  // Handle saving user edits
  const onSaveUserEdit = async (data: z.infer<typeof userFormSchema>) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: data.email,
          package_selected: data.package_selected,
          automation_active: data.automation_active
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully.',
      });

      fetchUsers();
      fetchAutomations();
      setIsEditingUser(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user.',
        variant: 'destructive',
      });
    }
  };

  // Handle editing a package
  const handleEditPackage = (pkg: Package) => {
    setCurrentPackage(pkg);
    packageForm.reset({
      name: pkg.name,
      price: pkg.price,
      description: pkg.description
    });
    setIsEditingPackage(true);
  };

  // Handle saving package edits
  const onSavePackageEdit = async (data: z.infer<typeof packageFormSchema>) => {
    // In a real app, this would update the package in the database
    toast({
      title: 'Feature Coming Soon',
      description: 'Package updating will be available in a future release.',
    });
    setIsEditingPackage(false);
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleting(true);
  };

  // Confirm user deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deleted successfully.',
      });

      fetchUsers();
      setIsDeleting(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user.',
        variant: 'destructive',
      });
    }
  };

  // Handle toggling automation status
  const toggleAutomationStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          automation_active: !currentStatus
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Automation ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });

      fetchAutomations();
    } catch (error: any) {
      console.error('Error toggling automation status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update automation status.',
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
            <p className="mt-4 text-gray-600">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">
              Manage users, packages, and automations
            </p>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="automations">Automations</TabsTrigger>
            </TabsList>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Users Management</CardTitle>
                      <CardDescription>View and manage all users</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={fetchUsers}
                      disabled={isLoadingUsers}
                    >
                      <RefreshCcw size={16} className={`mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="mt-2 text-gray-600">Loading users...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Automation Active</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map(user => (
                            <TableRow key={user.id}>
                              <TableCell className="font-mono text-xs">
                                {user.id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {user.package_selected || 'None'}
                              </TableCell>
                              <TableCell>
                                {user.automation_active ? (
                                  <CheckCircle className="text-green-500 h-5 w-5" />
                                ) : (
                                  <XCircle className="text-red-500 h-5 w-5" />
                                )}
                              </TableCell>
                              <TableCell>
                                {user.is_admin ? (
                                  <CheckCircle className="text-blue-500 h-5 w-5" />
                                ) : (
                                  <XCircle className="text-gray-300 h-5 w-5" />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Packages Tab */}
            <TabsContent value="packages">
              <Card>
                <CardHeader>
                  <CardTitle>Packages Management</CardTitle>
                  <CardDescription>View and manage subscription packages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price ($/month)</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map(pkg => (
                        <TableRow key={pkg.id}>
                          <TableCell>{pkg.name}</TableCell>
                          <TableCell>${pkg.price}</TableCell>
                          <TableCell>{pkg.description}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditPackage(pkg)}
                            >
                              <Edit size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Automations Tab */}
            <TabsContent value="automations">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Automations Management</CardTitle>
                      <CardDescription>View and manage active automations</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={fetchAutomations}
                      disabled={isLoadingAutomations}
                    >
                      <RefreshCcw size={16} className={`mr-2 ${isLoadingAutomations ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingAutomations ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="mt-2 text-gray-600">Loading automations...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Workflow ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Executions</TableHead>
                          <TableHead>Success Rate</TableHead>
                          <TableHead>Last Run</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {automations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                              No active automations found
                            </TableCell>
                          </TableRow>
                        ) : (
                          automations.map(automation => (
                            <TableRow key={automation.user_id}>
                              <TableCell>{automation.user_email}</TableCell>
                              <TableCell>{automation.package}</TableCell>
                              <TableCell className="font-mono text-xs">
                                {automation.workflow_id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                {automation.status ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Inactive
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{automation.stats.executions}</TableCell>
                              <TableCell>{automation.stats.success_rate}%</TableCell>
                              <TableCell>
                                {new Date(automation.stats.last_run).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant={automation.status ? "destructive" : "default"}
                                  onClick={() => toggleAutomationStatus(automation.user_id, automation.status)}
                                >
                                  {automation.status ? 'Deactivate' : 'Activate'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user details
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onSaveUserEdit)} className="space-y-4 pt-4">
              <FormField
                control={userForm.control}
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
              <FormField
                control={userForm.control}
                name="package_selected"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 px-3 py-2 border rounded-md"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      >
                        <option value="">None</option>
                        <option value="instagram">Instagram DM Automation</option>
                        <option value="whatsapp">WhatsApp Reminders</option>
                        <option value="bill">Bill Management</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="automation_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="m-0">Automation Active</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingUser(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditingPackage} onOpenChange={setIsEditingPackage}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>
              Make changes to package details
            </DialogDescription>
          </DialogHeader>
          <Form {...packageForm}>
            <form onSubmit={packageForm.handleSubmit(onSavePackageEdit)} className="space-y-4 pt-4">
              <FormField
                control={packageForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Package Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={packageForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($/month)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={packageForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Package description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingPackage(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
