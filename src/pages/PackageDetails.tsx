
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PackageFeature {
  title: string;
  included: boolean;
}

interface AiPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discountDuration?: number;
  features: PackageFeature[];
  primaryColor: string;
  icon: React.ReactNode;
}

const packages: Record<string, AiPackage> = {
  "social": {
    id: "social",
    name: "Pack Social",
    description: "Perfect for social media management and engagement",
    price: 300,
    discountedPrice: 250,
    discountDuration: 2,
    features: [
      { title: "Automated content creation", included: true },
      { title: "Social media scheduling", included: true },
      { title: "Engagement analytics", included: true },
      { title: "Audience insights", included: true },
      { title: "Multi-platform support", included: true },
      { title: "Advanced targeting", included: false },
      { title: "Custom reporting", included: false }
    ],
    primaryColor: "#3B82F6",
    icon: "📱"
  },
  "office": {
    id: "office",
    name: "Pack Office",
    description: "Optimize your office productivity and workflows",
    price: 450,
    features: [
      { title: "Document automation", included: true },
      { title: "Meeting scheduling", included: true },
      { title: "Email management", included: true },
      { title: "Task prioritization", included: true },
      { title: "Team collaboration", included: true },
      { title: "Project tracking", included: true },
      { title: "Workflow optimization", included: true }
    ],
    primaryColor: "#3B82F6",
    icon: "💼"
  },
  "manager": {
    id: "manager",
    name: "Pack Manager",
    description: "Advanced tools for team and project management",
    price: 500,
    features: [
      { title: "Team performance analytics", included: true },
      { title: "Resource allocation", included: true },
      { title: "Automated reporting", included: true },
      { title: "Goal tracking", included: true },
      { title: "Decision support", included: true },
      { title: "Risk assessment", included: true },
      { title: "Strategic planning", included: true }
    ],
    primaryColor: "#3B82F6",
    icon: "📊"
  },
  "closer": {
    id: "closer",
    name: "Pack Closer",
    description: "Close more deals with AI-powered sales assistance",
    price: 600,
    features: [
      { title: "Lead qualification", included: true },
      { title: "Sales pipeline management", included: true },
      { title: "Deal analytics", included: true },
      { title: "Negotiation assistance", included: true },
      { title: "Customer insights", included: true },
      { title: "Competitive analysis", included: true },
      { title: "Follow-up automation", included: true }
    ],
    primaryColor: "#3B82F6",
    icon: "🤝"
  }
};

const PackageDetails = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  
  const packageInfo = packageId && packages[packageId] ? packages[packageId] : null;
  
  if (!packageInfo) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Package Not Found</h1>
        <p className="mb-8">The requested package does not exist.</p>
        <Button onClick={() => navigate('/packages')}>View All Packages</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card className="border border-primary/20 shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl">{packageInfo.name}</CardTitle>
              <CardDescription className="text-lg mt-2">{packageInfo.description}</CardDescription>
            </div>
            <div className="text-4xl">{packageInfo.icon}</div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-8">
            <div className="flex items-end gap-2">
              {packageInfo.discountedPrice ? (
                <>
                  <h3 className="text-3xl font-bold">{packageInfo.discountedPrice}€</h3>
                  <span className="text-muted-foreground line-through">{packageInfo.price}€</span>
                  <span className="text-sm text-primary ml-2">
                    /month for {packageInfo.discountDuration} months, then {packageInfo.price}€
                  </span>
                </>
              ) : (
                <h3 className="text-3xl font-bold">{packageInfo.price}€<span className="text-sm text-muted-foreground">/month</span></h3>
              )}
            </div>
          </div>
          
          <h4 className="text-xl font-medium mb-4">Features</h4>
          <ul className="space-y-3">
            {packageInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className={`mr-2 ${feature.included ? 'text-green-500' : 'text-gray-400'}`}>
                  {feature.included ? '✓' : '✗'}
                </span>
                <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.title}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="flex justify-center py-6 bg-primary/5">
          <Button size="lg" onClick={() => navigate(`/checkout/${packageId}`)}>
            Subscribe Now
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => navigate('/packages')}>
          Back to All Packages
        </Button>
      </div>
    </div>
  );
};

export default PackageDetails;
