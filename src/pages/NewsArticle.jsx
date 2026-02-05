import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, TrendingUp, TrendingDown, Minus, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LiveTicker from '@/components/forex/LiveTicker';
import { createPageUrl } from '@/utils';

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: 'emerald', label: 'Bullish' },
  bearish: { icon: TrendingDown, color: 'rose', label: 'Bearish' },
  neutral: { icon: Minus, color: 'slate', label: 'Neutral' },
};

export default function NewsArticle() {
  const location = useLocation();
  const article = location.state?.article;

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article not found</h1>
          <Link to={createPageUrl('News')}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sentiment = sentimentConfig[article.sentiment];
  const Icon = sentiment.icon;

  return (
    <div className="min-h-screen bg-slate-950">
      <LiveTicker />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('News')}>
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
        >
          <div className="relative h-96">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`bg-${sentiment.color}-500/20 text-${sentiment.color}-400 border-${sentiment.color}-500/30`}>
                  <Icon className="w-3 h-3 mr-1" />
                  {sentiment.label}
                </Badge>
                {article.currencies.map((currency) => (
                  <Badge key={currency} variant="outline" className="border-slate-500 text-slate-300">
                    {currency}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{article.source}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.time}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
              <p className="text-xl text-slate-300 leading-relaxed">
                {article.summary}
              </p>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 leading-relaxed mb-4">
                This is a sample news article. In a production environment, this would contain the full article content 
                from your news feed API or database.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                The article would include detailed analysis, market implications, expert opinions, and relevant data 
                to help traders make informed decisions.
              </p>
              <p className="text-slate-300 leading-relaxed">
                You can expand this component to fetch and display real article content from your backend.
              </p>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}