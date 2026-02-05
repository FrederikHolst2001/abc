import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Search, Filter, TrendingUp, TrendingDown, Minus, Clock, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiveTicker from '@/components/forex/LiveTicker';
import UpgradePrompt from '@/components/forex/UpgradePrompt';
import AdSense from '@/components/AdSense';
import { createPageUrl } from '@/utils';

const newsArticles = [
  {
    id: 1,
    title: 'Federal Reserve Signals Potential Rate Cuts as Inflation Cools',
    summary: 'Fed officials indicated they may begin cutting interest rates as early as September, with Chair Powell noting significant progress on inflation targets.',
    source: 'Reuters',
    time: '12 min ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    category: 'central-banks',
    sentiment: 'bullish',
    currencies: ['USD', 'EUR'],
    featured: true,
  },
  {
    id: 2,
    title: 'ECB Maintains Rates but Hints at June Cut Amid Slowing Growth',
    summary: 'The European Central Bank kept its benchmark rate at 4.5% but President Lagarde opened the door to rate cuts in the coming months.',
    source: 'Bloomberg',
    time: '45 min ago',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=250&fit=crop',
    category: 'central-banks',
    sentiment: 'bearish',
    currencies: ['EUR'],
    featured: true,
  },
  {
    id: 3,
    title: 'UK Economy Shows Stronger Than Expected Growth in Q2',
    summary: 'British GDP grew 0.4% in the second quarter, beating analyst expectations of 0.3%, lifting the pound to three-month highs.',
    source: 'Financial Times',
    time: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400&h=250&fit=crop',
    category: 'economic-data',
    sentiment: 'bullish',
    currencies: ['GBP'],
    featured: false,
  },
  {
    id: 4,
    title: 'Bank of Japan Maintains Ultra-Loose Monetary Policy',
    summary: 'BoJ keeps negative interest rates unchanged despite persistent yen weakness. Governor Ueda signals patience on policy normalization.',
    source: 'Nikkei Asia',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=250&fit=crop',
    category: 'central-banks',
    sentiment: 'bearish',
    currencies: ['JPY'],
    featured: false,
  },
  {
    id: 5,
    title: 'Oil Prices Surge 3% on Middle East Supply Concerns',
    summary: 'Crude oil jumps on escalating geopolitical tensions, boosting commodity-linked currencies like CAD and NOK.',
    source: 'CNBC',
    time: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=250&fit=crop',
    category: 'commodities',
    sentiment: 'neutral',
    currencies: ['CAD', 'NOK'],
    featured: false,
  },
  {
    id: 6,
    title: 'Australian Employment Beats Forecasts, RBA Rate Cut Delayed',
    summary: 'Australia added 50,000 jobs in July, well above the 25,000 expected, reducing chances of near-term rate cuts.',
    source: 'AFR',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    category: 'economic-data',
    sentiment: 'bullish',
    currencies: ['AUD'],
    featured: false,
  },
  {
    id: 7,
    title: 'Swiss National Bank Signals No Rush to Cut Rates',
    summary: 'SNB Chairman Jordan indicates the central bank will take a cautious approach to rate cuts despite low inflation.',
    source: 'SWI',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=250&fit=crop',
    category: 'central-banks',
    sentiment: 'neutral',
    currencies: ['CHF'],
    featured: false,
  },
  {
    id: 8,
    title: 'Canadian Trade Surplus Widens on Energy Exports',
    summary: 'Canada posts larger than expected trade surplus as oil and natural gas exports surge, supporting the loonie.',
    source: 'Globe and Mail',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=250&fit=crop',
    category: 'economic-data',
    sentiment: 'bullish',
    currencies: ['CAD'],
    featured: false,
  },
];

const categories = [
  { value: 'all', label: 'All News' },
  { value: 'central-banks', label: 'Central Banks' },
  { value: 'economic-data', label: 'Economic Data' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'analysis', label: 'Analysis' },
];

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: 'emerald', label: 'Bullish' },
  bearish: { icon: TrendingDown, color: 'rose', label: 'Bearish' },
  neutral: { icon: Minus, color: 'slate', label: 'Neutral' },
};

export default function News() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveNews, setLiveNews] = useState([]);
  const [fetchingNews, setFetchingNews] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      fetchLiveNews();
      const interval = setInterval(fetchLiveNews, 3600000); // Update every hour
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchLiveNews = async () => {
    setFetchingNews(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the latest 8 forex market news articles from today. Include major currency pairs (EUR/USD, GBP/USD, USD/JPY, etc.), central bank decisions, economic data releases, and market-moving events. 
        
        For each article, provide:
        - title: clear, concise headline
        - summary: 2-3 sentence summary
        - source: news source (Reuters, Bloomberg, Financial Times, etc.)
        - time: how long ago (e.g., "5 min ago", "1 hour ago")
        - category: one of [central-banks, economic-data, commodities, analysis]
        - sentiment: one of [bullish, bearish, neutral]
        - currencies: array of affected currency codes (e.g., ["USD", "EUR"])
        - featured: true for top 2 most important stories, false for others`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  time: { type: "string" },
                  category: { type: "string" },
                  sentiment: { type: "string" },
                  currencies: { type: "array", items: { type: "string" } },
                  featured: { type: "boolean" }
                }
              }
            }
          }
        }
      });
      
      const articles = response.articles.map((article, index) => ({
        ...article,
        id: index + 1,
        image: `https://images.unsplash.com/photo-${1611974789855 + index}?w=400&h=250&fit=crop`
      }));
      
      setLiveNews(articles);
    } catch (error) {
      console.error('Failed to fetch live news:', error);
    } finally {
      setFetchingNews(false);
    }
  };

  if (loading) return null;

  const newsToDisplay = liveNews.length > 0 ? liveNews : newsArticles;
  
  const filteredNews = newsToDisplay.filter(article => {
    const matchesCategory = category === 'all' || article.category === category;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.filter(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured);

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
              <Newspaper className="w-8 h-8 text-blue-400" />
              Market News
              {liveNews.length > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Live
                </Badge>
              )}
            </h1>
            <p className="text-slate-400">
              {liveNews.length > 0 ? 'Real-time forex news powered by AI' : 'Latest forex news and market analysis'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={fetchLiveNews} 
              disabled={fetchingNews}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            >
              {fetchingNews ? 'Updating...' : 'Refresh News'}
            </Button>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8 overflow-x-auto pb-2"
        >
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-slate-800">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 whitespace-nowrap"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {featuredNews.map((article, index) => {
              const sentiment = sentimentConfig[article.sentiment];
              const Icon = sentiment.icon;
              
              return (
                <article
                  key={article.id}
                  onClick={() => navigate(createPageUrl('NewsArticle'), { state: { article } })}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all cursor-pointer group"
                >
                  <div className="relative h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-${sentiment.color}-500/20 text-${sentiment.color}-400 border-${sentiment.color}-500/30`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {sentiment.label}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{article.source}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {article.currencies.map((currency) => (
                          <Badge key={currency} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {currency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </motion.div>
        )}

        {/* Ad Banner */}
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 mb-8">
          <AdSense adSlot="3456789012" />
        </div>

        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((article, index) => {
            const sentiment = sentimentConfig[article.sentiment];
            const Icon = sentiment.icon;
            
            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => navigate(createPageUrl('NewsArticle'), { state: { article } })}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all cursor-pointer group"
              >
                <div className="relative h-40">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className={`p-1.5 rounded bg-${sentiment.color}-500/20`}>
                      <Icon className={`w-3 h-3 text-${sentiment.color}-400`} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                        <Bookmark className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No news found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}