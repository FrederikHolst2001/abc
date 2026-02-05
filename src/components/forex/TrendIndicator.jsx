import React from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const trends = [
  { pair: 'EUR/USD', shortTerm: 'bullish', mediumTerm: 'neutral', longTerm: 'bearish', strength: 65 },
  { pair: 'GBP/USD', shortTerm: 'bearish', mediumTerm: 'bearish', longTerm: 'neutral', strength: 72 },
  { pair: 'USD/JPY', shortTerm: 'bullish', mediumTerm: 'bullish', longTerm: 'bullish', strength: 85 },
  { pair: 'USD/CHF', shortTerm: 'neutral', mediumTerm: 'bearish', longTerm: 'bearish', strength: 45 },
  { pair: 'AUD/USD', shortTerm: 'bullish', mediumTerm: 'neutral', longTerm: 'neutral', strength: 52 },
  { pair: 'USD/CAD', shortTerm: 'bearish', mediumTerm: 'neutral', longTerm: 'bullish', strength: 38 },
];

const trendConfig = {
  bullish: { icon: TrendingUp, color: 'emerald', label: 'Up' },
  bearish: { icon: TrendingDown, color: 'rose', label: 'Down' },
  neutral: { icon: Minus, color: 'slate', label: 'Flat' },
};

const TrendIcon = ({ trend }) => {
  const config = trendConfig[trend];
  const Icon = config.icon;
  return (
    <div className={`p-1.5 rounded bg-${config.color}-500/20`}>
      <Icon className={`w-3 h-3 text-${config.color}-400`} />
    </div>
  );
};

export default function TrendIndicator() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Trend Analysis
        </h2>
        <p className="text-xs text-slate-500 mt-1">Multi-timeframe trend direction</p>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-slate-700/30 text-xs text-slate-500">
        <div>Pair</div>
        <div className="text-center">Short (1H)</div>
        <div className="text-center">Medium (4H)</div>
        <div className="text-center">Long (1D)</div>
        <div className="text-center">Strength</div>
      </div>

      <div className="divide-y divide-slate-700/30">
        {trends.map((item, index) => (
          <motion.div
            key={item.pair}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-5 gap-4 px-4 py-3 items-center hover:bg-slate-700/20 transition-colors cursor-pointer group"
          >
            <div className="font-medium text-white flex items-center gap-2">
              {item.pair}
              <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="flex justify-center">
              <TrendIcon trend={item.shortTerm} />
            </div>
            <div className="flex justify-center">
              <TrendIcon trend={item.mediumTerm} />
            </div>
            <div className="flex justify-center">
              <TrendIcon trend={item.longTerm} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.strength}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    item.strength >= 70 ? 'bg-emerald-500' :
                    item.strength >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
              </div>
              <span className="text-xs text-slate-400 w-8 text-right">{item.strength}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-slate-700/50 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-500">Bullish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <span className="text-slate-500">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-slate-500">Bearish</span>
        </div>
      </div>
    </div>
  );
}