
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, FileText, Check } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

// Define package data
const packages = [
  {
    id: 'instagram',
    name: 'Instagram DM Automation',
    price: 30,
    icon: MessageSquare,
    description: 'Automate replies to Instagram DMs with AI',
    features: [
      'AI-powered responses',
      'Message filtering',
      'Custom templates',
      'Performance analytics',
      '24/7 operation'
    ],
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    textColor: 'text-white'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Reminders',
    price: 25,
    icon: Clock,
    description: 'Schedule and send WhatsApp reminders automatically',
    features: [
      'Scheduled reminders',
      'Google Calendar integration',
      'Custom messages',
      'Recurring reminders',
      'Delivery confirmation'
    ],
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    textColor: 'text-white'
  },
  {
    id: 'bill',
    name: 'Bill Management',
    price: 35,
    icon: FileText,
    description: 'Never miss a payment with smart bill scheduling',
    features: [
      'Bill due date tracking',
      'Payment scheduling',
      'Google Calendar integration',
      'Payment confirmations',
      'Monthly reports'
    ],
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    textColor: 'text-white'
  }
];

const Packages = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSelectPackage = (packageId: string) => {
    navigate(`/setup/${packageId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Automation Package</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Select the automation package that best fits your needs. All packages include our AI-powered workflows.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`${pkg.color} p-6 flex flex-col items-center`}>
                  <pkg.icon className={`${pkg.textColor} w-12 h-12 mb-4`} />
                  <h2 className={`text-2xl font-bold ${pkg.textColor}`}>{pkg.name}</h2>
                  <div className={`mt-4 ${pkg.textColor}`}>
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="ml-1">/month</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 text-center mb-6">{pkg.description}</p>
                  
                  <ul className="mb-8 space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 mr-2 mt-1">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSelectPackage(pkg.id)} 
                    className="w-full py-6"
                  >
                    Select {pkg.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-8 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            Need help choosing? Contact our support team at <a href="mailto:support@keys-ai.com" className="text-primary">support@keys-ai.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Packages;
