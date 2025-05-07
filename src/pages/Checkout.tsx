
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface AiPackage {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  discountDuration?: number;
}

const packages: Record<string, AiPackage> = {
  "social": {
    id: "social",
    name: "Pack Social",
    price: 300,
    discountedPrice: 250,
    discountDuration: 2
  },
  "office": {
    id: "office",
    name: "Pack Office",
    price: 450,
  },
  "manager": {
    id: "manager",
    name: "Pack Manager",
    price: 500,
  },
  "closer": {
    id: "closer",
    name: "Pack Closer",
    price: 600,
  }
};

const Checkout = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState('');

  const packageInfo = packageId && packages[packageId] ? packages[packageId] : null;
  
  if (!packageInfo) {
    return (
      <ProtectedRoute>
        <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Package Not Found</h1>
          <p className="mb-8">The requested package does not exist.</p>
          <Button onClick={() => navigate('/packages')}>View All Packages</Button>
        </div>
      </ProtectedRoute>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would be replaced with actual Stripe integration
      // const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      //   body: {
      //     packageId,
      //     promoCode: promoCode || undefined
      //   }
      // });
      
      // Simulate successful checkout for now
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Processing payment",
          description: "You will be redirected to the payment page shortly.",
        });
        
        // This would normally redirect to Stripe
        // window.location.href = data.url;
        
        // For now, redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user?.email || ''} disabled />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" required />
                      </div>
                      <div>
                        <Label htmlFor="postal">Postal Code</Label>
                        <Input id="postal" required />
                      </div>
                    </div>
                    
                    {/* Credit card details would be handled by Stripe Elements in a real implementation */}
                    <div>
                      <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                      <Input 
                        id="promoCode" 
                        value={promoCode} 
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code" 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Processing...' : 'Complete Purchase'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{packageInfo.name}</span>
                    <span>
                      {packageInfo.discountedPrice ? 
                        `${packageInfo.discountedPrice}€` : 
                        `${packageInfo.price}€`}
                    </span>
                  </div>
                  
                  {packageInfo.discountedPrice && (
                    <div className="text-sm text-muted-foreground">
                      Special offer: {packageInfo.discountedPrice}€/month for {packageInfo.discountDuration} months, 
                      then {packageInfo.price}€/month
                    </div>
                  )}
                  
                  <div className="pt-4 mt-4 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total (monthly)</span>
                      <span>
                        {packageInfo.discountedPrice ? 
                          `${packageInfo.discountedPrice}€` : 
                          `${packageInfo.price}€`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 bg-primary/5">
                <div className="text-sm">
                  By proceeding, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and 
                  acknowledge you've read our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </div>
              </CardFooter>
            </Card>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate(`/package/${packageId}`)}>
                Back to Package Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Checkout;
