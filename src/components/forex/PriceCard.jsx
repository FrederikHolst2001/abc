import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PriceCard({ pair, basePrice, spread, change, direction, high, low, volume }) {
  const [price, setPrice] = useState(basePrice);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.001;
      const newPrice = basePrice + fluctuation;
      setPrice(newPrice);
      setFlash(fluctuation > 0 ? 'up' : 'down');
      setTimeout(() => setFlash(null), 300);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [basePrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            direction === 'up' ? 'bg-emerald-400' : direction === 'down' ? 'bg-rose-400' : 'bg-slate-500'
          } animate-pulse`} />
          <h3 className="text-white font-semibold text-lg">{pair}</h3>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
          direction === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
          direction === 'down' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-600/50 text-slate-400'
        }`}>
          {direction === 'up' && <TrendingUp className="w-3 h-3" />}
          {direction === 'down' && <TrendingDown className="w-3 h-3" />}
          <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 rounded-lg ${
                flash === 'up' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
              }`}
            />
          )}
        </AnimatePresence>
        <div className="text-3xl font-mono font-bold text-white tracking-tight">
          {price.toFixed(pair.includes('JPY') ? 2 : 5)}
        </div>
        <div className="text-xs text-slate-500 mt-1">Spread: {spread} pips</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700/50">
        <div>
          <div className="text-xs text-slate-500 mb-1">High</div>
          <div className="text-sm font-mono text-emerald-400">{high.toFixed(pair.includes('JPY') ? 2 : 5)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Low</div>
          <div className="text-sm font-mono text-rose-400">{low.toFixed(pair.includes('JPY') ? 2 : 5)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Volume</div>
          <div className="text-sm font-mono text-slate-300 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {volume}
          </div>
        </div>
      </div>
    </motion.div>
  );
}