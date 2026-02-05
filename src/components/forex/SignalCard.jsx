import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Shield, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const signalConfig = {
  buy: {
    color: 'emerald',
    bgGradient: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'border-emerald-500/30',
    icon: TrendingUp,
    label: 'STRONG BUY',
  },
  sell: {
    color: 'rose',
    bgGradient: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'border-rose-500/30',
    icon: TrendingDown,
    label: 'STRONG SELL',
  },
  neutral: {
    color: 'amber',
    bgGradient: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'border-amber-500/30',
    icon: Minus,
    label: 'NEUTRAL',
  },
};

export default function SignalCard({ 
  pair, 
  signal, 
  confidence, 
  entry, 
  stopLoss, 
  takeProfit, 
  timeframe,
  indicators 
}) {
  const config = signalConfig[signal];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-xl border ${config.borderColor} p-5 relative overflow-hidden`}
    >
      {/* Signal Indicator */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <Icon className="w-full h-full" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{pair}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-500">{timeframe}</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${config.color}-500/20`}>
          <Icon className={`w-5 h-5 text-${config.color}-400`} />
          <span className={`font-bold text-${config.color}-400`}>{config.label}</span>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Confidence</span>
          <span className={`text-${config.color}-400 font-semibold`}>{confidence}%</span>
        </div>
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-400 rounded-full`}
          />
        </div>
      </div>

      {/* Trade Levels */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <BarChart3 className="w-3 h-3" />
            Entry
          </div>
          <div className="font-mono font-semibold text-white">{entry}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-xs text-rose-400 mb-1">
            <Shield className="w-3 h-3" />
            Stop Loss
          </div>
          <div className="font-mono font-semibold text-rose-400">{stopLoss}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-xs text-emerald-400 mb-1">
            <Target className="w-3 h-3" />
            Take Profit
          </div>
          <div className="font-mono font-semibold text-emerald-400">{takeProfit}</div>
        </div>
      </div>

      {/* Indicators */}
      <div>
        <div className="text-xs text-slate-500 mb-2">Supporting Indicators</div>
        <div className="flex flex-wrap gap-2">
          {indicators.map((indicator, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`text-xs border-${indicator.bullish ? 'emerald' : indicator.bearish ? 'rose' : 'slate'}-500/30 
                text-${indicator.bullish ? 'emerald' : indicator.bearish ? 'rose' : 'slate'}-400`}
            >
              {indicator.name}: {indicator.value}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}