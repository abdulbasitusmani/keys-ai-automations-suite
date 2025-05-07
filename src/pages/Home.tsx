
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NavBar from '@/components/NavBar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI Assistants for Your Business
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Boost productivity and streamline operations with our suite of specialized AI agents
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/packages')}>
                Explore Packages
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* AI Agents Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our AI Agents</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Specialized AI assistants designed to tackle your business challenges
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Pack Social */}
              <Card className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">📱</div>
                  <h3 className="text-2xl font-bold mb-2">Pack Social</h3>
                  <p className="text-muted-foreground mb-4">
                    Perfect for social media management and engagement
                  </p>
                  <p className="font-bold text-primary mb-2">250€/month for 2 months</p>
                  <p className="text-sm text-muted-foreground mb-4">Then 300€/month</p>
                  <Button onClick={() => navigate('/package/social')} className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Pack Office */}
              <Card className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-2xl font-bold mb-2">Pack Office</h3>
                  <p className="text-muted-foreground mb-4">
                    Optimize your office productivity and workflows
                  </p>
                  <p className="font-bold mb-6">450€/month</p>
                  <Button onClick={() => navigate('/package/office')} className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Pack Manager */}
              <Card className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold mb-2">Pack Manager</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced tools for team and project management
                  </p>
                  <p className="font-bold mb-6">500€/month</p>
                  <Button onClick={() => navigate('/package/manager')} className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Pack Closer */}
              <Card className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-2xl font-bold mb-2">Pack Closer</h3>
                  <p className="text-muted-foreground mb-4">
                    Close more deals with AI-powered sales assistance
                  </p>
                  <p className="font-bold mb-6">600€/month</p>
                  <Button onClick={() => navigate('/package/closer')} className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Hear from businesses that have transformed their operations with our AI assistants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-primary">
                      {"★".repeat(5)}
                    </div>
                    <p className="italic mb-6">
                      "Pack Social has completely transformed our social media strategy. We've seen a 40% increase in engagement and saved 15 hours per week on content creation."
                    </p>
                    <div className="mt-auto">
                      <p className="font-bold">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Marketing Director, TechGrowth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-primary">
                      {"★".repeat(5)}
                    </div>
                    <p className="italic mb-6">
                      "The Pack Manager AI has given our leadership team invaluable insights into resource allocation and team performance. It's like having an expert analyst on call 24/7."
                    </p>
                    <div className="mt-auto">
                      <p className="font-bold">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">COO, InnovateX</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-primary">
                      {"★".repeat(5)}
                    </div>
                    <p className="italic mb-6">
                      "After implementing Pack Closer, our sales team's close rate improved by 28% in the first quarter. The AI's ability to analyze prospects and suggest personalized approaches has been game-changing."
                    </p>
                    <div className="mt-auto">
                      <p className="font-bold">Jessica Martinez</p>
                      <p className="text-sm text-muted-foreground">Sales Director, GrowthForce</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the AI package that fits your needs and start optimizing your operations today
            </p>
            <Button size="lg" onClick={() => navigate('/packages')}>
              View All Packages
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
