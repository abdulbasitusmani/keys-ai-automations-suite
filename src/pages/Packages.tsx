
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  icon: React.ReactNode;
  popularFeatures: string[];
}

const packages: Package[] = [
  {
    id: "social",
    name: "Pack Social",
    description: "Perfect for social media management and engagement",
    price: 300,
    discountedPrice: 250,
    icon: "📱",
    popularFeatures: ["Automated content creation", "Social media scheduling", "Engagement analytics"]
  },
  {
    id: "office",
    name: "Pack Office",
    description: "Optimize your office productivity and workflows",
    price: 450,
    icon: "💼",
    popularFeatures: ["Document automation", "Meeting scheduling", "Email management"]
  },
  {
    id: "manager",
    name: "Pack Manager",
    description: "Advanced tools for team and project management",
    price: 500,
    icon: "📊",
    popularFeatures: ["Team performance analytics", "Resource allocation", "Automated reporting"]
  },
  {
    id: "closer",
    name: "Pack Closer",
    description: "Close more deals with AI-powered sales assistance",
    price: 600,
    icon: "🤝",
    popularFeatures: ["Lead qualification", "Sales pipeline management", "Deal analytics"]
  }
];

const Packages = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your AI Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Select the perfect AI package tailored to your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="card-hover border border-primary/20">
            <CardHeader className="pb-3">
              <div className="text-3xl mb-3">{pkg.icon}</div>
              <CardTitle>{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-muted-foreground mb-4">{pkg.description}</p>
              <div className="flex items-end gap-2 mb-6">
                {pkg.discountedPrice ? (
                  <>
                    <h3 className="text-2xl font-bold">{pkg.discountedPrice}€</h3>
                    <span className="text-muted-foreground line-through">{pkg.price}€</span>
                    <span className="text-xs text-primary">/month</span>
                  </>
                ) : (
                  <h3 className="text-2xl font-bold">{pkg.price}€<span className="text-xs text-muted-foreground">/month</span></h3>
                )}
              </div>
              <ul className="space-y-2 text-sm">
                {pkg.popularFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
                <li className="text-primary text-sm mt-1">+ more features</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate(`/package/${pkg.id}`)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="mb-6 text-muted-foreground">
          Contact our team to discuss enterprise solutions and custom AI integrations tailored to your specific business requirements.
        </p>
        <Button variant="outline" onClick={() => navigate('/contact')}>
          Contact Sales
        </Button>
      </div>
    </div>
  );
};

export default Packages;
