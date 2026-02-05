import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Filter, RefreshCw, TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiveTicker from '@/components/forex/LiveTicker';
import SignalCard from '@/components/forex/SignalCard';
import UpgradePrompt from '@/components/forex/UpgradePrompt';

const signals = [
  {
    pair: 'EUR/USD',
    signal: 'buy',
    confidence: 78,
    entry: '1.0845',
    stopLoss: '1.0810',
    takeProfit: '1.0920',
    timeframe: '4H',
    indicators: [
      { name: 'RSI', value: '42', bullish: true },
      { name: 'MACD', value: 'Bullish Cross', bullish: true },
      { name: 'EMA', value: 'Above 200', bullish: true },
      { name: 'Support', value: '1.0830', bullish: false },
    ],
  },
  {
    pair: 'GBP/USD',
    signal: 'sell',
    confidence: 82,
    entry: '1.2635',
    stopLoss: '1.2680',
    takeProfit: '1.2540',
    timeframe: '1H',
    indicators: [
      { name: 'RSI', value: '68', bearish: true },
      { name: 'MACD', value: 'Bearish Divergence', bearish: true },
      { name: 'Resistance', value: '1.2650', bearish: true },
      { name: 'Volume', value: 'Declining', bearish: true },
    ],
  },
  {
    pair: 'USD/JPY',
    signal: 'buy',
    confidence: 85,
    entry: '154.30',
    stopLoss: '153.80',
    takeProfit: '155.50',
    timeframe: '1D',
    indicators: [
      { name: 'Trend', value: 'Strong Up', bullish: true },
      { name: 'ADX', value: '35', bullish: true },
      { name: 'Stochastic', value: '55', bullish: false },
      { name: 'BoJ Policy', value: 'Dovish', bullish: true },
    ],
  },
  {
    pair: 'AUD/USD',
    signal: 'neutral',
    confidence: 45,
    entry: '0.6540',
    stopLoss: '0.6500',
    takeProfit: '0.6600',
    timeframe: '4H',
    indicators: [
      { name: 'RSI', value: '50', neutral: true },
      { name: 'MACD', value: 'Flat', neutral: true },
      { name: 'Range', value: 'Consolidating', neutral: true },
      { name: 'Support', value: '0.6520', bullish: false },
    ],
  },
  {
    pair: 'USD/CAD',
    signal: 'sell',
    confidence: 72,
    entry: '1.3645',
    stopLoss: '1.3690',
    takeProfit: '1.3550',
    timeframe: '4H',
    indicators: [
      { name: 'Oil Correlation', value: 'Rising Oil', bearish: true },
      { name: 'RSI', value: '62', bearish: true },
      { name: 'Double Top', value: 'Forming', bearish: true },
      { name: 'CAD Strength', value: 'Increasing', bearish: true },
    ],
  },
  {
    pair: 'EUR/GBP',
    signal: 'buy',
    confidence: 68,
    entry: '0.8585',
    stopLoss: '0.8555',
    takeProfit: '0.8640',
    timeframe: '1H',
    indicators: [
      { name: 'Breakout', value: 'Confirmed', bullish: true },
      { name: 'Volume', value: 'Increasing', bullish: true },
      { name: 'RSI', value: '54', bullish: false },
      { name: 'Support', value: '0.8570', bullish: true },
    ],
  },
];



export default function Signals() {
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveSignals, setLiveSignals] = useState([]);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin();
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && user.subscription_plan === 'pro') {
      fetchLiveSignals();
      const interval = setInterval(fetchLiveSignals, 3600000); // Update every hour
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchLiveSignals = async () => {
    setIsRefreshing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 6 current forex trading signals based on real market conditions today. Use technical analysis and current market trends.
        
        For each signal provide:
        - pair: currency pair (EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, EUR/GBP)
        - signal: one of [buy, sell, neutral]
        - confidence: number 65-95 (percentage)
        - entry: entry price (realistic for current market)
        - stopLoss: stop loss price
        - takeProfit: take profit price
        - timeframe: one of [1H, 4H, 1D]
        - indicators: array of 3-4 technical indicators with bullish/bearish status
          each indicator: { name: string, status: "bullish" or "bearish" }`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            signals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pair: { type: "string" },
                  signal: { type: "string" },
                  confidence: { type: "number" },
                  entry: { type: "number" },
                  stopLoss: { type: "number" },
                  takeProfit: { type: "number" },
                  timeframe: { type: "string" },
                  indicators: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        status: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      setLiveSignals(response.signals);
    } catch (error) {
      console.error('Failed to fetch live signals:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchLiveSignals();
  };

  if (loading) return null;
  
  if (!user) return null;
  
  const hasAccess = user.subscription_plan === 'pro';
  
  if (!hasAccess) {
    return <UpgradePrompt feature="Trading Signals" />;
  }

  const signalsToDisplay = liveSignals.length > 0 ? liveSignals : signals;
  
  const signalSummary = {
    buy: signalsToDisplay.filter(s => s.signal === 'buy').length,
    sell: signalsToDisplay.filter(s => s.signal === 'sell').length,
    neutral: signalsToDisplay.filter(s => s.signal === 'neutral').length,
  };

  const filteredSignals = filter === 'all' 
    ? signalsToDisplay 
    : signalsToDisplay.filter(s => s.signal === filter);

  return (
    <div className="min-h-screen">
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-400" />
              Trading Signals
              {liveSignals.length > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Live Analysis
                </Badge>
              )}
            </h1>
            <p className="text-slate-400">
              {liveSignals.length > 0 ? 'Real-time AI analysis of current market conditions' : 'AI-powered signals based on technical analysis'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              onClick={handleRefresh}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{signalSummary.buy}</div>
              <div className="text-sm text-slate-400">Buy Signals</div>
            </div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-500/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-400">{signalSummary.sell}</div>
              <div className="text-sm text-slate-400">Sell Signals</div>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Minus className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{signalSummary.neutral}</div>
              <div className="text-sm text-slate-400">Neutral</div>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-6"
        >
          <Filter className="w-4 h-4 text-slate-500" />
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-slate-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All Signals</TabsTrigger>
              <TabsTrigger value="buy" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Buy</TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-400">Sell</TabsTrigger>
              <TabsTrigger value="neutral" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Neutral</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Signal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map((signal, index) => (
            <motion.div
              key={signal.pair}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <SignalCard {...signal} />
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
        >
          <p className="text-xs text-slate-500 text-center">
            <strong className="text-slate-400">Disclaimer:</strong> Trading signals are for informational purposes only and should not be considered as financial advice. 
            Past performance does not guarantee future results. Always conduct your own analysis before making trading decisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}