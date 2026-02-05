import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calendar, Newspaper, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import LiveTicker from '@/components/forex/LiveTicker';
import PriceCard from '@/components/forex/PriceCard';
import MarketSummary from '@/components/forex/MarketSummary';
import AdSense from '@/components/AdSense';

const initialMajorPairs = [
  { pair: 'EUR/USD', basePrice: 1.08472, spread: 0.8, change: 0.12, direction: 'up', high: 1.08645, low: 1.08234, volume: '2.4M' },
  { pair: 'GBP/USD', basePrice: 1.26342, spread: 1.2, change: -0.08, direction: 'down', high: 1.26598, low: 1.26012, volume: '1.8M' },
  { pair: 'USD/JPY', basePrice: 154.32, spread: 1.0, change: 0.24, direction: 'up', high: 154.89, low: 153.78, volume: '2.1M' },
  { pair: 'USD/CHF', basePrice: 0.88234, spread: 1.5, change: -0.05, direction: 'down', high: 0.88456, low: 0.87998, volume: '890K' },
  { pair: 'AUD/USD', basePrice: 0.65423, spread: 1.1, change: 0.03, direction: 'up', high: 0.65687, low: 0.65123, volume: '1.2M' },
  { pair: 'USD/CAD', basePrice: 1.36452, spread: 1.3, change: 0.00, direction: 'neutral', high: 1.36789, low: 1.36098, volume: '980K' },
];

const features = [
  { icon: TrendingUp, title: 'Real-Time Prices', description: 'Live streaming quotes from major forex pairs' },
  { icon: BarChart3, title: 'Technical Analysis', description: 'Advanced indicators and automated signals' },
  { icon: Calendar, title: 'Economic Calendar', description: 'High-impact events with forecasts and actuals' },
  { icon: Newspaper, title: 'Market News', description: 'Breaking news affecting currency markets' },
];

export default function Home() {
  const [majorPairs, setMajorPairs] = useState(initialMajorPairs);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const { data } = await base44.functions.invoke('fetchForexData', {});
        
        if (data.pairs && data.pairs.length > 0) {
          const formattedPairs = data.pairs.slice(0, 6).map(pair => ({
            pair: pair.pair,
            basePrice: pair.price,
            spread: 1.2,
            change: pair.change,
            direction: pair.direction,
            high: pair.high,
            low: pair.low,
            volume: typeof pair.volume === 'number' ? `${(pair.volume / 1000000).toFixed(1)}M` : pair.volume
          }));
          setMajorPairs(formattedPairs);
        }
      } catch (error) {
        console.error('Failed to fetch live forex prices:', error);
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Live Ticker */}
      <LiveTicker />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Real-time market data</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Professional Forex
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trading Intelligence
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Access real-time prices, technical analysis, economic calendar, and AI-powered trading signals. 
              Everything you need in one professional platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to={createPageUrl('Analysis')}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg">
                  Start Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Signals')}>
                <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-6 text-lg">
                  View Signals
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Price Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {majorPairs.map((pair, index) => (
              <motion.div
                key={pair.pair}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PriceCard {...pair} />
              </motion.div>
            ))}
          </div>

          {/* Market Summary */}
          <MarketSummary />

          {/* Ad Banner */}
          <div className="mt-8 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <AdSense adSlot="1234567890" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Professional Trading Tools</h2>
            <p className="text-slate-400">Everything you need for informed trading decisions</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Currency Pairs' },
              { value: '24/7', label: 'Market Coverage' },
              { value: '< 1s', label: 'Data Latency' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}