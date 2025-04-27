
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, FileText, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';

const instagramFormSchema = z.object({
  username: z.string().min(1, 'Instagram username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type InstagramFormValues = z.infer<typeof instagramFormSchema>;

const Agents = () => {
  const navigate = useNavigate();
  const { user, supabase } = useSupabaseAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedAgents, setSelectedAgents] = React.useState<string[]>([]);

  const form = useForm<InstagramFormValues>({
    resolver: zodResolver(instagramFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const agents = [
    {
      id: 'instagram',
      name: 'Instagram Agent',
      description: 'Automate your Instagram Comments & DMs',
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      isActive: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Agent',
      description: 'Automate WhatsApp responses and scheduling',
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      isActive: false
    },
    {
      id: 'bills',
      name: 'Bill Management Agent',
      description: 'Track and manage your bills automatically',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      isActive: false
    }
  ];

  const handleAgentClick = async (agentId: string) => {
    if (agentId === 'instagram') {
      setIsDialogOpen(true);
    } else {
      if (!selectedAgents.includes(agentId)) {
        setSelectedAgents([...selectedAgents, agentId]);
      }
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
      setIsSubmitting(true);
      
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
      setSelectedAgents([...selectedAgents, 'instagram']);
      
      toast({
        title: "Connection Successful",
        description: "Your Instagram account has been connected!",
      });
      
      await supabase
        .from('profiles')
        .update({ 
          package_selected: 'instagram',
          automation_active: true
        })
        .eq('id', user.id);

      form.reset();
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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Agents</h1>
              <p className="mt-2 text-gray-600">
                Select one or more agents to help automate your tasks
              </p>
            </div>
            {selectedAgents.length > 0 && (
              <Button onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card 
                key={agent.id} 
                className={`hover:shadow-md transition-shadow ${
                  selectedAgents.includes(agent.id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-full ${agent.bgColor}`}>
                      <agent.icon className={`h-5 w-5 ${agent.color}`} />
                    </div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    {agent.isActive ? (
                      <p>Ready to help you automate your workflow.</p>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Lock size={14} />
                        <p>Coming soon</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => agent.isActive ? handleAgentClick(agent.id) : null}
                    disabled={!agent.isActive}
                    variant={selectedAgents.includes(agent.id) ? "secondary" : "default"}
                  >
                    {selectedAgents.includes(agent.id) 
                      ? "Selected" 
                      : agent.isActive 
                        ? "Select Agent" 
                        : "Coming Soon"
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))}
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

export default Agents;
