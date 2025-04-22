import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { insertSubscriberSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const formSchema = insertSubscriberSchema.extend({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function NewsletterSection() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/subscribe", values);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    subscribeMutation.mutate(data);
  }

  return (
    <section className="py-16 bg-[#222236] text-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated with Gaming News</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and never miss the latest game reviews, news, and exclusive content.
        </p>
        
        {isSubmitted ? (
          <div className="bg-primary/20 p-6 rounded-lg max-w-xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Thank You for Subscribing!</h3>
            <p>You have successfully subscribed to our newsletter. Stay tuned for the latest updates!</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row max-w-xl mx-auto gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input 
                        placeholder="Your email address" 
                        className="px-5 py-3 rounded-lg text-[#222236] focus:outline-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left text-sm text-red-300" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-secondary/90 text-white font-bold px-6 py-3 rounded-lg"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? "Subscribing..." : (
                  <>
                    Subscribe <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
        <p className="text-xs text-gray-400 mt-4">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </section>
  );
}
