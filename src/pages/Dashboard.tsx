
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

// Mock subscription data - in a real app, this would come from your backend
const mockSubscription = {
  package: "social",
  name: "Pack Social",
  status: "active",
  currentPrice: 250,
  nextBillingDate: "2025-06-07",
  startDate: "2025-05-01"
};

interface AgentCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const agentCards: AgentCard[] = [
  {
    id: "social",
    name: "Pack Social",
    description: "Manage your social media presence with AI assistance",
    icon: "📱"
  },
  {
    id: "office",
    name: "Pack Office",
    description: "Optimize your office workflows and productivity",
    icon: "💼"
  },
  {
    id: "manager",
    name: "Pack Manager",
    description: "Streamline your management tasks and team insights",
    icon: "📊"
  },
  {
    id: "closer",
    name: "Pack Closer",
    description: "Close more deals with AI-powered sales tools",
    icon: "🤝"
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  // This would be replaced with actual subscription data from your backend
  const subscription = mockSubscription;
  const hasActiveSubscription = true; // This would be determined by checking actual subscription status

  const handleManageSubscription = () => {
    // This would be replaced with actual Stripe customer portal redirection
    toast({
      title: "Subscription Management",
      description: "Redirecting to subscription management page...",
    });
    setTimeout(() => navigate('/settings'), 1500);
  };

  const handleLaunchAgent = (agentId: string) => {
    toast({
      title: "Launching Agent",
      description: `Opening ${agentId} interface...`,
    });
    // In a real app, this would open the agent's interface
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
          </div>
          
          {hasActiveSubscription && (
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0" 
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {hasActiveSubscription ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Subscription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Package:</span>
                        <span>{subscription.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Current Price:</span>
                        <span>{subscription.currentPrice}€/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Next Billing Date:</span>
                        <span>{subscription.nextBillingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Subscription Start:</span>
                        <span>{subscription.startDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleManageSubscription}>
                      Manage Subscription
                    </Button>
                  </CardFooter>
                </Card>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Your AI Agents</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {agentCards.filter(agent => agent.id === subscription.package).map(agent => (
                      <Card key={agent.id} className="card-hover">
                        <CardHeader className="pb-2">
                          <div className="text-3xl mb-2">{agent.icon}</div>
                          <CardTitle>{agent.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-muted-foreground text-sm">{agent.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleLaunchAgent(agent.id)}>
                            Launch Agent
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">You currently don't have an active subscription to any of our AI packages.</p>
                  <p>Explore our packages and choose the one that best fits your needs.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate('/packages')}>View Packages</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Available Agents</h2>
            {hasActiveSubscription ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agentCards.map(agent => {
                  const isSubscribed = agent.id === subscription.package;
                  return (
                    <Card key={agent.id} className={`card-hover ${isSubscribed ? 'border-primary' : ''}`}>
                      <CardHeader className="pb-2">
                        {isSubscribed && (
                          <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5 w-fit mb-2">
                            Active
                          </div>
                        )}
                        <div className="text-3xl mb-2">{agent.icon}</div>
                        <CardTitle>{agent.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-muted-foreground text-sm">{agent.description}</p>
                      </CardContent>
                      <CardFooter>
                        {isSubscribed ? (
                          <Button className="w-full" onClick={() => handleLaunchAgent(agent.id)}>
                            Launch Agent
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" onClick={() => navigate(`/package/${agent.id}`)}>
                            View Details
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Subscribe to one of our AI packages to get access to our AI agents.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate('/packages')}>View Packages</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                {hasActiveSubscription ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
                      <div>Date</div>
                      <div>Description</div>
                      <div className="text-right">Amount</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4 border-b">
                      <div>May 1, 2025</div>
                      <div>Pack Social - Monthly subscription</div>
                      <div className="text-right">€250.00</div>
                    </div>
                  </div>
                ) : (
                  <p>No billing history available.</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={handleManageSubscription}>
                  Manage Payment Methods
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
