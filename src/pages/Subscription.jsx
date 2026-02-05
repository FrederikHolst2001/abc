import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Zap, TrendingUp, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LiveTicker from '@/components/forex/LiveTicker';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    period: '7 days',
    features: [
      'Real-time forex prices',
      'Basic technical analysis',
      'Economic calendar',
      'Limited news access',
      'Email support',
    ],
    current: true,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 19,
    period: 'month',
    popular: true,
    features: [
      'Everything in Free Trial',
      'Advanced technical indicators',
      'AI-powered trading signals',
      'Unlimited news access',
      'Price alerts',
      'Priority support',
      'Custom watchlists',
      'Multi-timeframe analysis',
      'Expert market insights',
      'API access',
      'Custom integrations',
    ],
  },
];

export default function Subscription() {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planId) => {
    if (planId === 'free') return;
    
    // Check if running in iframe
    if (window.self !== window.top) {
      toast.error('Checkout is only available from the published app. Please open this page in a new tab.');
      return;
    }
    
    setLoading(planId);
    try {
      const response = await base44.functions.invoke('createCheckout', {
        priceId: 'price_1StSeMKB4qropAQKOylQ26Qm',
        successUrl: `${window.location.origin}${createPageUrl('Home')}`,
        cancelUrl: `${window.location.origin}${createPageUrl('Subscription')}`
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-slate-400 text-lg">
            Unlock powerful forex trading tools and insights
          </p>
        </motion.div>

        {/* Current Plan Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Free Trial Active</h3>
                  <p className="text-slate-400 text-sm">You have full access to all professional features for 7 days</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className={`relative ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-500/10 to-slate-800/50 border-blue-500/50' 
                  : 'bg-slate-800/50 border-slate-700'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-400 ml-2">/ {plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={plan.current || loading === plan.id}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {loading === plan.id ? (
                      'Processing...'
                    ) : plan.current ? (
                      'Current Plan'
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map((method) => (
                  <div
                    key={method}
                    className="p-4 bg-slate-900/50 rounded-lg text-center text-slate-400 border border-slate-700"
                  >
                    {method}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Secure payment processing • Cancel anytime</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}