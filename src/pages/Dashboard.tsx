
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Clock, FileText, CheckCircle, AlertCircle, 
  BarChart, Settings, RefreshCcw, Power, ExternalLink, UserIcon, Plus
} from 'lucide-react';

const packageIcons = {
  instagram: MessageSquare,
  whatsapp: Clock,
  bill: FileText
} as const;

const packageColors = {
  instagram: 'bg-purple-100 text-purple-500',
  whatsapp: 'bg-green-100 text-green-500',
  bill: 'bg-blue-100 text-blue-500'
} as const;

const packageNames = {
  instagram: 'Instagram DM Automation',
  whatsapp: 'WhatsApp Reminders',
  bill: 'Bill Management'
} as const;

interface Stats {
  instagram: {
    dmsSent: number;
    responseRate: number;
    avgResponseTime: string;
  };
  whatsapp: {
    remindersDelivered: number;
    deliveryRate: number;
    scheduledReminders: number;
  };
  bill: {
    billsScheduled: number;
    paymentsProcessed: number;
    upcomingPayments: number;
  };
}

interface ConnectedAccount {
  id: string;
  username: string;
  connected_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, supabase } = useSupabaseAuth();
  const [userData, setUserData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [connectedAccounts, setConnectedAccounts] = React.useState<ConnectedAccount[]>([]);
  const [stats, setStats] = React.useState<Stats>({
    instagram: {
      dmsSent: 0,
      responseRate: 0,
      avgResponseTime: '0s'
    },
    whatsapp: {
      remindersDelivered: 0,
      deliveryRate: 0,
      scheduledReminders: 0
    },
    bill: {
      billsScheduled: 0,
      paymentsProcessed: 0,
      upcomingPayments: 0
    }
  });
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('package_selected, credentials, automation_active, n8n_workflow_id')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserData(data || {});
        
        // Fetch connected accounts if a package is selected
        if (data?.package_selected) {
          if (data.package_selected === 'instagram') {
            const { data: accountsData, error: accountsError } = await supabase
              .from('instagram_accounts')
              .select('id, username, connected_at')
              .eq('user_id', user.id);
            
            if (accountsError) throw accountsError;
            setConnectedAccounts(accountsData || []);
          }
          
          if (data?.automation_active) {
            fetchMockStats(data.package_selected);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate, supabase, toast]);
  
  const fetchMockStats = (packageType: string) => {
    console.log('Fetching stats for:', packageType);
    
    setTimeout(() => {
      switch (packageType) {
        case 'instagram':
          setStats(prev => ({
            ...prev,
            instagram: {
              dmsSent: Math.floor(Math.random() * 50) + 10,
              responseRate: Math.floor(Math.random() * 30) + 70,
              avgResponseTime: `${Math.floor(Math.random() * 50) + 10}s`
            }
          }));
          break;
        case 'whatsapp':
          setStats(prev => ({
            ...prev,
            whatsapp: {
              remindersDelivered: Math.floor(Math.random() * 20) + 5,
              deliveryRate: Math.floor(Math.random() * 10) + 90,
              scheduledReminders: Math.floor(Math.random() * 10) + 2
            }
          }));
          break;
        case 'bill':
          setStats(prev => ({
            ...prev,
            bill: {
              billsScheduled: Math.floor(Math.random() * 10) + 1,
              paymentsProcessed: Math.floor(Math.random() * 5),
              upcomingPayments: Math.floor(Math.random() * 3) + 1
            }
          }));
          break;
      }
    }, 500);
  };
  
  const handleRefreshStats = async () => {
    if (!userData?.package_selected) return;
    
    setIsRefreshing(true);
    fetchMockStats(userData.package_selected);
    
    toast({
      title: 'Stats Refreshed',
      description: 'Your automation statistics have been updated.'
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleDeactivateAutomation = async () => {
    try {
      setIsDeactivating(true);
      
      console.log('Deactivating automation for:', userData?.package_selected);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          automation_active: false
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUserData({
        ...userData,
        automation_active: false
      });
      
      toast({
        title: 'Success',
        description: 'Your automation has been deactivated'
      });
      
    } catch (error: any) {
      console.error('Deactivation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate automation',
        variant: 'destructive',
      });
    } finally {
      setIsDeactivating(false);
    }
  };
  
  const handleActivateAutomation = async () => {
    try {
      setIsDeactivating(true); // Reuse the same state for the loading indicator
      
      console.log('Activating automation for:', userData?.package_selected);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          automation_active: true
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUserData({
        ...userData,
        automation_active: true
      });
      
      toast({
        title: 'Success',
        description: 'Your automation has been activated'
      });
      
    } catch (error: any) {
      console.error('Activation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate automation',
        variant: 'destructive',
      });
    } finally {
      setIsDeactivating(false);
    }
  };
  
  const handleSetupPackage = () => {
    navigate('/agents');
  };

  const handleViewAutomationDetails = () => {
    if (userData?.package_selected) {
      navigate(`/automation/${userData.package_selected}`);
    }
  };

  const handleAddAccount = () => {
    if (userData?.package_selected === 'instagram') {
      navigate('/connect-instagram');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }
  
  const PackageIcon = userData?.package_selected 
    ? packageIcons[userData.package_selected as keyof typeof packageIcons] 
    : null;
  
  const packageColor = userData?.package_selected 
    ? packageColors[userData.package_selected as keyof typeof packageColors] 
    : '';
  
  const packageName = userData?.package_selected 
    ? packageNames[userData.package_selected as keyof typeof packageNames]
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">
                  Manage your automations and view statistics
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRefreshStats}
                  disabled={isRefreshing || !userData?.automation_active}
                  className="flex items-center gap-2"
                >
                  <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                  Refresh Stats
                </Button>
                
                <Button
                  onClick={() => navigate('/packages')}
                  variant="secondary"
                >
                  <Settings size={16} className="mr-2" />
                  Manage Packages
                </Button>
              </div>
            </div>
            
            <Card className="shadow-md">
              <CardHeader className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl">Active Automation</CardTitle>
                  <CardDescription>Your current automation package</CardDescription>
                </div>
                
                {userData?.package_selected ? (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                    {userData.automation_active ? (
                      <>
                        <CheckCircle size={16} className="text-green-500" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-amber-500" />
                        <span>Inactive</span>
                      </>
                    )}
                  </div>
                ) : null}
              </CardHeader>
              
              <CardContent>
                {!userData?.package_selected ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500 mb-6">
                      Select your first automation package to get started
                    </p>
                    <Button onClick={handleSetupPackage}>
                      Select a Package
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-lg ${packageColor} flex items-center justify-center`}>
                        {PackageIcon && <PackageIcon size={32} />}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{packageName}</h3>
                      
                      {/* Connected Accounts Section */}
                      {userData.package_selected === 'instagram' && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Connected Accounts</h4>
                          
                          {connectedAccounts.length > 0 ? (
                            <div className="space-y-4">
                              {connectedAccounts.map(account => (
                                <div key={account.id} className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <UserIcon size={16} className="text-gray-500" />
                                      <span className="font-medium">{account.username}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      ID: {account.id.substring(0, 8)}...
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Connected on: {new Date(account.connected_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/automation/${userData.package_selected}?account=${account.id}`)}
                                    className="flex items-center gap-1"
                                  >
                                    <ExternalLink size={14} />
                                    Details
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">No accounts connected yet.</p>
                          )}
                          
                          <Button
                            onClick={handleAddAccount}
                            variant="outline"
                            className="mt-3 flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Connect Account
                          </Button>
                        </div>
                      )}
                      
                      {/* Package Statistics Section */}
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {userData.package_selected === 'instagram' && (
                          <>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">DMs Sent</p>
                              <p className="text-2xl font-bold">{stats.instagram.dmsSent}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Response Rate</p>
                              <p className="text-2xl font-bold">{stats.instagram.responseRate}%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Avg Response Time</p>
                              <p className="text-2xl font-bold">{stats.instagram.avgResponseTime}</p>
                            </div>
                          </>
                        )}
                        
                        {userData.package_selected === 'whatsapp' && (
                          <>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Reminders Delivered</p>
                              <p className="text-2xl font-bold">{stats.whatsapp.remindersDelivered}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Delivery Rate</p>
                              <p className="text-2xl font-bold">{stats.whatsapp.deliveryRate}%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Scheduled Reminders</p>
                              <p className="text-2xl font-bold">{stats.whatsapp.scheduledReminders}</p>
                            </div>
                          </>
                        )}
                        
                        {userData.package_selected === 'bill' && (
                          <>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Bills Scheduled</p>
                              <p className="text-2xl font-bold">{stats.bill.billsScheduled}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Payments Processed</p>
                              <p className="text-2xl font-bold">{stats.bill.paymentsProcessed}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Upcoming Payments</p>
                              <p className="text-2xl font-bold">{stats.bill.upcomingPayments}</p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <Button
                        onClick={handleViewAutomationDetails}
                        variant="outline"
                        className="mt-6 flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {userData?.package_selected && (
                <CardFooter className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-full md:w-auto flex justify-center">
                    <Button
                      onClick={handleSetupPackage}
                      variant="outline"
                      className="w-full md:w-auto"
                    >
                      Select Another Package
                    </Button>
                  </div>
                  
                  <div className="w-full md:w-auto flex justify-center">
                    {userData.automation_active ? (
                      <Button 
                        variant="destructive"
                        onClick={handleDeactivateAutomation}
                        disabled={isDeactivating}
                        className="w-full md:w-auto"
                      >
                        <Power size={16} className="mr-2" />
                        {isDeactivating ? 'Deactivating...' : 'Deactivate Automation'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleActivateAutomation}
                        disabled={isDeactivating}
                        className="w-full md:w-auto"
                      >
                        <Power size={16} className="mr-2" />
                        {isDeactivating ? 'Activating...' : 'Activate Automation'}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
            
            {userData?.package_selected && userData.automation_active && (
              <Tabs defaultValue="stats" className="mt-6">
                <TabsList className="grid w-full md:w-fit grid-cols-2 md:grid-cols-3">
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stats" className="mt-4">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Performance Statistics</CardTitle>
                          <CardDescription>View detailed performance metrics for your automation</CardDescription>
                        </div>
                        <BarChart className="text-gray-400" />
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <p>Advanced statistics coming soon!</p>
                        <p className="text-sm mt-2">We're working on detailed analytics for your automations.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Automation Settings</CardTitle>
                      <CardDescription>Configure your automation preferences</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <p>Advanced settings coming soon!</p>
                        <p className="text-sm mt-2">We're working on customizable settings for your automations.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="logs">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Activity Logs</CardTitle>
                      <CardDescription>View the history of your automation activities</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <p>Activity logs coming soon!</p>
                        <p className="text-sm mt-2">We're working on detailed logs for your automations.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
