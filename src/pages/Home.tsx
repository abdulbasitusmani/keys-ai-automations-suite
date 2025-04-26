
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { ArrowRight, Bot, MessageSquare, Clock, FileText } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/packages');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-16 pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  <span className="text-primary">Automate</span> Your Business 
                  <span className="text-primary"> Workflows</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  KEYS-AI gives you the power to automate Instagram DMs, 
                  WhatsApp reminders, and bill management with intelligent AI workflows.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleGetStarted} 
                    size="lg"
                    className="text-lg px-8 py-6 flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6"
                  >
                    Login
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                  <div className="flex justify-center items-center p-4">
                    <Bot size={60} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-6">AI-Powered Automations</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MessageSquare className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Instagram DM Automation</h4>
                        <p className="text-gray-600">Respond to messages automatically with AI</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Clock className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">WhatsApp Reminders</h4>
                        <p className="text-gray-600">Schedule and send reminders automatically</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Bill Management</h4>
                        <p className="text-gray-600">Never miss a payment with smart scheduling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How KEYS-AI Works</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Our platform makes automation simple. Choose a package, connect your accounts, and let AI handle the rest.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Choose a Package</h3>
                <p className="text-gray-700">
                  Select from our Instagram DM Automation, WhatsApp Reminders, or Bill Management packages.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect Your Accounts</h3>
                <p className="text-gray-700">
                  Link your Instagram, WhatsApp, or Google Calendar with our secure authentication.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
                <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Enjoy Automation</h3>
                <p className="text-gray-700">
                  Watch as KEYS-AI handles your tasks, with detailed stats in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Automate Your Business?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join KEYS-AI today and transform how you handle Instagram DMs, WhatsApp reminders, and bill payments.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              variant="secondary"
              className="text-primary font-semibold px-8"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold">KEYS-<span className="text-primary">AI</span></span>
              </div>
              <p className="text-gray-400">
                Powerful automation solutions for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Packages</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Login</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sign Up</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: info@keys-ai.com<br />
                Phone: (123) 456-7890
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} KEYS-AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
