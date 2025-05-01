
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, Clock, FileText, Settings, ArrowLeft, 
  User, Bell, BarChart3, Server, Code, Database, Gauge
} from 'lucide-react';
import { 
  SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, 
  SidebarMenuButton, SidebarGroup, SidebarHeader, SidebarFooter, SidebarSeparator 
} from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

const AutomationDetails = () => {
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId: string }>();
  const { user, supabase } = useSupabaseAuth();
  const { toast } = useToast();
  const [userData, setUserData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState<string>('overview');
  const [instagramAccount, setInstagramAccount] = React.useState<any>(null);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('package_selected, credentials, automation_active, n8n_workflow_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setUserData(profileData);

        // If it's an Instagram automation, fetch the Instagram account details
        if (packageId === 'instagram') {
          const { data: igData, error: igError } = await supabase
            .from('instagram_accounts')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (igError) throw igError;
          setInstagramAccount(igData);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load automation details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, supabase, toast, packageId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Package information
  const PackageIcon = packageId ? packageIcons[packageId as keyof typeof packageIcons] : MessageSquare;
  const packageColor = packageId ? packageColors[packageId as keyof typeof packageColors] : '';
  const packageName = packageId ? packageNames[packageId as keyof typeof packageNames] : 'Unknown Package';

  // Menu items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Gauge },
    { id: 'account', label: 'Account', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'workflows', label: 'Workflows', icon: Code },
    { id: 'integrations', label: 'Integrations', icon: Server },
    { id: 'data', label: 'Data', icon: Database },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading automation details...</p>
          </div>
        </main>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Automation Overview</CardTitle>
              <CardDescription>Summary of your automation settings and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-md ${packageColor}`}>
                    <PackageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{packageName}</h3>
                    <p className="text-sm text-gray-500">
                      Status: {userData?.automation_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Actions</p>
                    <p className="text-2xl font-bold">247</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Success Rate</p>
                    <p className="text-2xl font-bold">98.2%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Active Since</p>
                    <p className="text-2xl font-bold">14 days</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">Action performed successfully</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'account':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your connected account details</CardDescription>
            </CardHeader>
            <CardContent>
              {packageId === 'instagram' && instagramAccount ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Instagram Account</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded">
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p>{instagramAccount.username}</p>
                      </div>
                      <div className="p-4 border rounded">
                        <p className="text-sm font-medium text-gray-500">Connected Since</p>
                        <p>{new Date(instagramAccount.connected_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Button variant="outline" className="mt-4">
                      Update Account Credentials
                    </Button>
                  </div>
                </div>
              ) : (
                <p>No account information available</p>
              )}
            </CardContent>
          </Card>
        );
      
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure your automation preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                Settings configuration coming soon!
              </p>
            </CardContent>
          </Card>
        );
      
      case 'notifications':
      case 'analytics': 
      case 'workflows':
      case 'integrations':
      case 'data':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</CardTitle>
              <CardDescription>This feature is coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>We're working on adding this feature!</p>
                <p className="text-sm mt-2">Check back soon for updates.</p>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <div>Select a section from the sidebar</div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <Sidebar>
            <SidebarHeader className="border-b border-gray-200">
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className="flex w-full justify-start items-center gap-2" 
                  onClick={handleBackToDashboard}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        tooltip={item.label}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup>
                <div className="p-4">
                  <div className={`p-2 rounded-md ${packageColor} inline-block`}>
                    <PackageIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-medium mt-2">{packageName}</h3>
                  <p className="text-xs text-gray-500">
                    {userData?.automation_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <p className="text-xs text-gray-500">
                  Automation ID: {userData?.n8n_workflow_id || 'Not assigned'}
                </p>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AutomationDetails;
