import React, { useState, useEffect } from 'react';
import { Globe, TrendingUp, TrendingDown, Clock, DollarSign, Activity, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const marketData = [
  { name: 'DXY (Dollar Index)', value: '104.52', change: '+0.23%', up: true },
  { name: 'Gold (XAU/USD)', value: '2,034.50', change: '-0.15%', up: false },
  { name: 'Oil (WTI)', value: '78.45', change: '+1.24%', up: true },
  { name: 'S&P 500', value: '5,234.18', change: '+0.45%', up: true },
];

const sessionHours = [
  { name: 'London', time: '08:00 - 16:00 GMT', start: 8, end: 16 },
  { name: 'New York', time: '13:00 - 21:00 GMT', start: 13, end: 21 },
  { name: 'Tokyo', time: '00:00 - 08:00 GMT', start: 0, end: 8 },
  { name: 'Sydney', time: '22:00 - 06:00 GMT', start: 22, end: 6 },
];

const isSessionActive = (start, end, currentHour) => {
  if (start > end) {
    // Handle sessions that cross midnight (like Sydney)
    return currentHour >= start || currentHour < end;
  }
  return currentHour >= start && currentHour < end;
};

export default function MarketSummary() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const updateSessions = () => {
      const now = new Date();
      const currentHour = now.getUTCHours();
      
      const updatedSessions = sessionHours.map(session => {
        const active = isSessionActive(session.start, session.end, currentHour);
        return {
          ...session,
          status: active ? 'open' : 'closed',
          active
        };
      });
      
      setSessions(updatedSessions);
    };

    updateSessions();
    const interval = setInterval(updateSessions, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Market Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Market Overview</h3>
        </div>
        <div className="space-y-3">
          {marketData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
            >
              <span className="text-sm text-slate-400">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-white">{item.value}</span>
                <span className={`flex items-center gap-1 text-xs ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trading Sessions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold">Trading Sessions</h3>
        </div>
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${session.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-sm text-white whitespace-nowrap">{session.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-slate-500 whitespace-nowrap">{session.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                  session.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'
                }`}>
                  {session.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}