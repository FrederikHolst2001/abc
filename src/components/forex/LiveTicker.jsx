import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const initialTickerData = [
  { pair: 'EUR/USD', price: 1.0847, change: 0.12, direction: 'up' },
  { pair: 'GBP/USD', price: 1.2634, change: -0.08, direction: 'down' },
  { pair: 'USD/JPY', price: 154.32, change: 0.24, direction: 'up' },
  { pair: 'USD/CHF', price: 0.8823, change: -0.05, direction: 'down' },
  { pair: 'AUD/USD', price: 0.6542, change: 0.03, direction: 'up' },
  { pair: 'USD/CAD', price: 1.3645, change: 0.00, direction: 'neutral' },
  { pair: 'NZD/USD', price: 0.5987, change: -0.11, direction: 'down' },
  { pair: 'EUR/GBP', price: 0.8586, change: 0.06, direction: 'up' },
  { pair: 'EUR/JPY', price: 167.34, change: 0.31, direction: 'up' },
  { pair: 'GBP/JPY', price: 194.89, change: -0.15, direction: 'down' },
];

export default function LiveTicker() {
  const [tickerData, setTickerData] = useState(initialTickerData);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const { data } = await base44.functions.invoke('fetchForexData', {});
        
        if (data.pairs && data.pairs.length > 0) {
          setTickerData(data.pairs);
        }
      } catch (error) {
        console.error('Failed to fetch live forex data:', error);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  const duplicatedData = [...tickerData, ...tickerData];

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 overflow-hidden">
      <motion.div
        className="flex items-center gap-8 py-2.5 px-4"
        animate={{ x: [0, -50 * tickerData.length] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedData.map((item, index) => (
          <div
            key={`${item.pair}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            <span className="text-slate-400 font-medium text-sm">{item.pair}</span>
            <span className="text-white font-mono font-semibold">{item.price.toFixed(4)}</span>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              item.direction === 'up' ? 'text-emerald-400' :
              item.direction === 'down' ? 'text-rose-400' : 'text-slate-500'
            }`}>
              {item.direction === 'up' && <TrendingUp className="w-3 h-3" />}
              {item.direction === 'down' && <TrendingDown className="w-3 h-3" />}
              {item.direction === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%</span>
            </div>
            <div className="w-px h-4 bg-slate-700 ml-4" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}