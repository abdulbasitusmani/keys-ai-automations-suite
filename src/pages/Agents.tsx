
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, FileText, Lock } from 'lucide-react';

const Agents = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Agent</h1>
            <p className="mt-2 text-gray-600">
              Select an agent to help automate your daily tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
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
                    onClick={() => agent.isActive ? navigate(`/connect/${agent.id}`) : null}
                    disabled={!agent.isActive}
                  >
                    {agent.isActive ? "Configure" : "Coming Soon"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agents;
