import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Generate mock price data
const generatePriceData = (basePrice, volatility, points, timeframe) => {
  let price = basePrice;
  const now = new Date();
  
  const getTimeLabel = (index) => {
    const minutesPerPoint = {
      '1M': 1,
      '5M': 5,
      '15M': 15,
      '1H': 60,
      '4H': 240,
      '1D': 1440
    };
    
    const minutesBack = (points - 1 - index) * minutesPerPoint[timeframe];
    const pointTime = new Date(now.getTime() - minutesBack * 60000);
    
    if (timeframe === '1D') {
      return `${String(pointTime.getDate()).padStart(2, '0')}/${String(pointTime.getMonth() + 1).padStart(2, '0')}`;
    } else {
      return `${String(pointTime.getHours()).padStart(2, '0')}:${String(pointTime.getMinutes()).padStart(2, '0')}`;
    }
  };

  return Array.from({ length: points }, (_, i) => {
    price += (Math.random() - 0.48) * volatility;
    const sma20 = price + (Math.random() - 0.5) * volatility * 0.5;
    const sma50 = price + (Math.random() - 0.5) * volatility * 0.8;
    return {
      time: getTimeLabel(i),
      price: parseFloat(price.toFixed(5)),
      sma20: parseFloat(sma20.toFixed(5)),
      sma50: parseFloat(sma50.toFixed(5)),
      volume: Math.floor(Math.random() * 1000) + 500,
    };
  });
};

const pairs = [
  { code: 'EUR/USD', basePrice: 1.0847, volatility: 0.0015 },
  { code: 'GBP/USD', basePrice: 1.2634, volatility: 0.0020 },
  { code: 'USD/JPY', basePrice: 154.32, volatility: 0.15 },
  { code: 'USD/CHF', basePrice: 0.8823, volatility: 0.0012 },
];

const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

const indicators = [
  { name: 'RSI (14)', value: 58.4, signal: 'neutral', description: 'Relative Strength Index' },
  { name: 'MACD', value: '0.0012', signal: 'bullish', description: 'Moving Average Convergence Divergence' },
  { name: 'Stochastic', value: '72.3', signal: 'overbought', description: 'Stochastic Oscillator' },
  { name: 'ADX', value: '32.1', signal: 'trending', description: 'Average Directional Index' },
  { name: 'CCI', value: '+85', signal: 'bullish', description: 'Commodity Channel Index' },
  { name: 'ATR', value: '0.0045', signal: 'normal', description: 'Average True Range' },
];

const signalColors = {
  bullish: 'text-emerald-400 bg-emerald-500/20',
  bearish: 'text-rose-400 bg-rose-500/20',
  neutral: 'text-slate-400 bg-slate-500/20',
  overbought: 'text-amber-400 bg-amber-500/20',
  oversold: 'text-blue-400 bg-blue-500/20',
  trending: 'text-purple-400 bg-purple-500/20',
  normal: 'text-slate-400 bg-slate-500/20',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
        <div className="text-xs text-slate-500 mb-1">{payload[0].payload.time}</div>
        <div className="text-lg font-mono text-white">{payload[0].value}</div>
        <div className="flex gap-4 mt-2 text-xs">
          <div>
            <span className="text-blue-400">SMA20: </span>
            <span className="text-white">{payload[0].payload.sma20}</span>
          </div>
          <div>
            <span className="text-purple-400">SMA50: </span>
            <span className="text-white">{payload[0].payload.sma50}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TechnicalAnalysis() {
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [showSMA, setShowSMA] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const intervalMap = {
          '1M': '1min',
          '5M': '5min',
          '15M': '15min',
          '1H': '1h',
          '4H': '4h',
          '1D': '1day'
        };

        const { data } = await base44.functions.invoke('fetchTimeSeries', {
          pair: selectedPair.code,
          interval: intervalMap[selectedTimeframe],
          outputsize: 48
        });

        if (data.data && data.data.length > 0) {
          const formattedData = data.data.map((item, index) => {
            const prices = data.data.slice(Math.max(0, index - 20), index + 1).map(d => d.price);
            const sma20 = prices.length >= 20 ? prices.reduce((a, b) => a + b, 0) / prices.length : item.price;
            
            const prices50 = data.data.slice(Math.max(0, index - 50), index + 1).map(d => d.price);
            const sma50 = prices50.length >= 50 ? prices50.reduce((a, b) => a + b, 0) / prices50.length : item.price;

            const timeObj = new Date(item.time);
            const timeLabel = selectedTimeframe === '1D' 
              ? `${String(timeObj.getDate()).padStart(2, '0')}/${String(timeObj.getMonth() + 1).padStart(2, '0')}`
              : `${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`;

            return {
              time: timeLabel,
              price: item.price,
              sma20: parseFloat(sma20.toFixed(5)),
              sma50: parseFloat(sma50.toFixed(5)),
              volume: item.volume
            };
          });
          setChartData(formattedData);
        } else {
          setChartData(generatePriceData(selectedPair.basePrice, selectedPair.volatility, 48, selectedTimeframe));
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setChartData(generatePriceData(selectedPair.basePrice, selectedPair.volatility, 48, selectedTimeframe));
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, [selectedPair, selectedTimeframe]);
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : selectedPair.basePrice;
  const prevPrice = chartData.length > 0 ? chartData[0].price : selectedPair.basePrice;
  const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;
  const isUp = priceChange >= 0;

  const pivotPoints = {
    r3: currentPrice + selectedPair.volatility * 3,
    r2: currentPrice + selectedPair.volatility * 2,
    r1: currentPrice + selectedPair.volatility,
    pivot: currentPrice,
    s1: currentPrice - selectedPair.volatility,
    s2: currentPrice - selectedPair.volatility * 2,
    s3: currentPrice - selectedPair.volatility * 3,
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedPair.code}
              onValueChange={(code) => setSelectedPair(pairs.find(p => p.code === code))}
            >
              <SelectTrigger className="w-32 bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {pairs.map((pair) => (
                  <SelectItem key={pair.code} value={pair.code} className="text-white hover:bg-slate-700">
                    {pair.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <div className="text-2xl font-mono font-bold text-white">
                {currentPrice.toFixed(selectedPair.code.includes('JPY') ? 2 : 5)}
              </div>
              <div className={`flex items-center gap-1 text-sm ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isUp ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTimeframe(tf)}
                className={`text-xs px-3 py-1 h-7 ${
                  selectedTimeframe === tf
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) => value.toFixed(selectedPair.code.includes('JPY') ? 1 : 4)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              {showSMA && (
                <>
                  <Area
                    type="monotone"
                    dataKey="sma20"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    fill="none"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="sma50"
                    stroke="#a855f7"
                    strokeWidth={1}
                    fill="none"
                    dot={false}
                  />
                </>
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke={isUp ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSMA(!showSMA)}
              className={`text-xs ${showSMA ? 'text-blue-400' : 'text-slate-500'}`}
            >
              <Activity className="w-3 h-3 mr-1" />
              Moving Averages
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500 rounded" />
              <span className="text-slate-500">SMA 20</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-purple-500 rounded" />
              <span className="text-slate-500">SMA 50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="p-4 border-t border-slate-700/50">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Technical Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {indicators.map((indicator) => (
            <motion.div
              key={indicator.name}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-lg p-3"
            >
              <div className="text-xs text-slate-500 mb-1">{indicator.name}</div>
              <div className="text-lg font-mono text-white mb-2">{indicator.value}</div>
              <Badge className={`text-xs ${signalColors[indicator.signal]}`}>
                {indicator.signal}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pivot Points */}
      <div className="p-4 border-t border-slate-700/50">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          Pivot Points
        </h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {Object.entries(pivotPoints).map(([key, value]) => (
            <div
              key={key}
              className={`flex-1 min-w-[80px] text-center p-2 rounded-lg ${
                key.startsWith('r') ? 'bg-emerald-500/10' :
                key.startsWith('s') ? 'bg-rose-500/10' : 'bg-slate-700/50'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                key.startsWith('r') ? 'text-emerald-400' :
                key.startsWith('s') ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {key.toUpperCase()}
              </div>
              <div className="text-sm font-mono text-white">
                {value.toFixed(selectedPair.code.includes('JPY') ? 2 : 5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}