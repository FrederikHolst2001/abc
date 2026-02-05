import React from 'react';
import { Newspaper, Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const news = [
  {
    id: 1,
    title: 'Fed Signals Potential Rate Cut in September Meeting',
    source: 'Reuters',
    time: '12 min ago',
    impact: 'high',
    sentiment: 'bullish',
    currencies: ['USD', 'EUR'],
    summary: 'Federal Reserve officials indicated they may begin cutting interest rates as early as September, citing cooling inflation data.',
  },
  {
    id: 2,
    title: 'ECB Holds Rates Steady, Lagarde Hints at Future Cuts',
    source: 'Bloomberg',
    time: '45 min ago',
    impact: 'high',
    sentiment: 'bearish',
    currencies: ['EUR'],
    summary: 'The European Central Bank kept its benchmark rate unchanged but President Lagarde suggested cuts could come in coming months.',
  },
  {
    id: 3,
    title: 'UK GDP Beats Expectations, Sterling Rallies',
    source: 'Financial Times',
    time: '1 hour ago',
    impact: 'medium',
    sentiment: 'bullish',
    currencies: ['GBP'],
    summary: 'British economy grew 0.4% in Q2, surpassing analyst expectations of 0.3%, sending the pound higher.',
  },
  {
    id: 4,
    title: 'Bank of Japan Maintains Ultra-Loose Policy',
    source: 'Nikkei',
    time: '2 hours ago',
    impact: 'high',
    sentiment: 'bearish',
    currencies: ['JPY'],
    summary: 'BoJ keeps negative rates unchanged despite yen weakness, Governor Ueda signals patience on policy shift.',
  },
  {
    id: 5,
    title: 'Oil Prices Surge on Middle East Tensions',
    source: 'CNBC',
    time: '3 hours ago',
    impact: 'medium',
    sentiment: 'neutral',
    currencies: ['CAD', 'NOK'],
    summary: 'Crude oil jumps 3% amid escalating geopolitical concerns, boosting commodity-linked currencies.',
  },
  {
    id: 6,
    title: 'Australian Employment Data Surprises to Upside',
    source: 'AFR',
    time: '4 hours ago',
    impact: 'medium',
    sentiment: 'bullish',
    currencies: ['AUD'],
    summary: 'Australia added 50,000 jobs in July, well above the 25,000 forecast, supporting RBA rate expectations.',
  },
];

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: 'emerald', label: 'Bullish' },
  bearish: { icon: TrendingDown, color: 'rose', label: 'Bearish' },
  neutral: { icon: Minus, color: 'slate', label: 'Neutral' },
};

export default function NewsFeed() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Market News</h2>
        </div>
        <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
          <Zap className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <div className="divide-y divide-slate-700/30 max-h-[600px] overflow-y-auto">
        {news.map((item, index) => {
          const sentiment = sentimentConfig[item.sentiment];
          const Icon = sentiment.icon;

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-slate-700/20 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-${sentiment.color}-500/20 mt-1`}>
                  <Icon className={`w-4 h-4 text-${sentiment.color}-400`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500">{item.source}</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                    {item.impact === 'high' && (
                      <Badge className="bg-rose-500/20 text-rose-400 text-xs px-1.5 py-0">
                        High Impact
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.currencies.map((currency) => (
                        <Badge
                          key={currency}
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-400"
                        >
                          {currency}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-blue-400 transition-colors">
                      Read more
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}