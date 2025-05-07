
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Send, MailIcon, MessageSquareText, CalendarIcon } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Support = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would call a backend API endpoint
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Message Sent',
        description: 'Thank you for your message. We will get back to you soon.',
      });
      
      form.reset();
      setSubmitted(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to frequently asked questions or contact our support team for assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* FAQs Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg p-1">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center text-left">
                      <MessageSquareText className="h-5 w-5 text-primary mr-2" />
                      How do I connect my Instagram account?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    To connect your Instagram account, go to the Instagram Agent page from your dashboard. 
                    Click on "Connect Instagram Account" and enter your Instagram username and password. 
                    Our system will securely store your credentials and use them to automate responses.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border rounded-lg p-1">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center text-left">
                      <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                      What is a Google Calendar ID?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    A Google Calendar ID is a unique identifier for your calendar. You can find it in your Google Calendar 
                    settings under "Calendar Settings" &gt; "Integrate Calendar." It typically looks like 
                    "example@gmail.com" or a longer string ending with "calendar.google.com" for custom calendars.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border rounded-lg p-1">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center text-left">
                      <MailIcon className="h-5 w-5 text-primary mr-2" />
                      How do I get a WhatsApp API key?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    To get a WhatsApp Business API key, you need to register as a WhatsApp Business Solution Provider 
                    or work with an existing provider. Visit the WhatsApp Business Platform website, complete the 
                    application process, and once approved, you'll receive API credentials to use with our system.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border rounded-lg p-1">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center text-left">
                      <MessageSquareText className="h-5 w-5 text-primary mr-2" />
                      How do I cancel my subscription?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    To cancel your subscription, go to your Profile page and navigate to the Billing section. 
                    Click on "Cancel Subscription" and follow the prompts. Your subscription will remain active 
                    until the end of the current billing period, and you won't be charged again.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border rounded-lg p-1">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center text-left">
                      <MessageSquareText className="h-5 w-5 text-primary mr-2" />
                      Is my data secure?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    Yes, we take data security seriously. All sensitive data, including API keys and credentials, 
                    are encrypted in our database. We use secure HTTPS connections for all communications and 
                    follow best practices for data protection. We never share your data with third parties 
                    without your explicit consent.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and our support team will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-6">
                      <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-4">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                      <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="How can we help you?"
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© 2025 KEYS-AI. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary">Terms</a>
              <a href="#" className="text-gray-600 hover:text-primary">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
