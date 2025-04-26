
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { MessageSquare, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

type PackageType = 'instagram' | 'whatsapp' | 'bill';

// Maps to help with package-specific data
const packageDetails: Record<PackageType, {
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  webhookUrl: string;
}> = {
  instagram: {
    name: 'Instagram DM Automation',
    icon: MessageSquare,
    color: 'text-purple-500',
    webhookUrl: 'https://your-n8n-instance/webhook/instagram',
  },
  whatsapp: {
    name: 'WhatsApp Reminders',
    icon: Clock,
    color: 'text-green-500',
    webhookUrl: 'https://your-n8n-instance/webhook/whatsapp',
  },
  bill: {
    name: 'Bill Management',
    icon: FileText,
    color: 'text-blue-500',
    webhookUrl: 'https://your-n8n-instance/webhook/bill',
  }
};

const Activate = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, supabase } = useSupabaseAuth();
  const [isActivating, setIsActivating] = React.useState(false);
  const [credentials, setCredentials] = React.useState<any>(null);
  const [activationStatus, setActivationStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  
  // Cast packageId to PackageType
  const packageType = (packageId as PackageType) || 'instagram';
  
  // Ensure packageId is valid
  React.useEffect(() => {
    if (!packageId || !['instagram', 'whatsapp', 'bill'].includes(packageId)) {
      navigate('/packages');
    }
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch user credentials
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('credentials, package_selected')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.credentials) {
          setCredentials(data.credentials);
        }
        
        // If package doesn't match, redirect to setup
        if (data.package_selected !== packageType) {
          navigate(`/setup/${packageType}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your credentials. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    fetchUserData();
  }, [packageId, user, navigate, supabase, toast, packageType]);
  
  const packageInfo = packageDetails[packageType];
  
  const handleActivateAutomation = async () => {
    try {
      setIsActivating(true);
      
      // In a real implementation, this would call your n8n webhook
      // This is a simulated API call
      console.log('Activating automation for:', packageType);
      console.log('Using credentials:', credentials);
      console.log('Webhook URL:', packageInfo.webhookUrl);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user's n8n_workflow_id
      const { error } = await supabase
        .from('users')
        .update({ 
          n8n_workflow_id: `mock-${packageType}-workflow-id`,
          automation_active: true
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setActivationStatus('success');
      
      toast({
        title: 'Success',
        description: `Your ${packageInfo.name} automation has been activated!`,
      });
      
    } catch (error: any) {
      console.error('Activation error:', error);
      setActivationStatus('error');
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate automation',
        variant: 'destructive',
      });
    } finally {
      setIsActivating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 flex items-center space-x-3">
            <div className={`p-3 rounded-full bg-${packageType === 'instagram' ? 'purple' : packageType === 'whatsapp' ? 'green' : 'blue'}-100`}>
              <packageInfo.icon className={packageInfo.color} size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Activate {packageInfo.name}</h1>
              <p className="text-gray-600">
                You're ready to activate your automation
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {activationStatus === 'idle' ? (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-8 text-sm text-blue-700">
                  <p className="font-semibold mb-2">Almost there!</p>
                  <p>
                    Your {packageInfo.name} is set up and ready to activate. 
                    Click the button below to start your automation.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleActivateAutomation}
                    size="lg"
                    className="px-8"
                    disabled={isActivating}
                  >
                    {isActivating ? 'Activating...' : 'Activate Automation'}
                  </Button>
                </div>
              </>
            ) : activationStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Automation Activated!</h2>
                <p className="text-gray-600 mb-6">
                  Your {packageInfo.name} is now up and running.
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-6">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Activation Failed</h2>
                <p className="text-gray-600 mb-6">
                  There was a problem activating your automation.
                </p>
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleActivateAutomation}
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {activationStatus === 'idle' && (
            <div className="mt-8 text-center">
              <Button 
                variant="ghost"
                onClick={() => navigate(`/setup/${packageType}`)}
              >
                Back to Setup
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Activate;
