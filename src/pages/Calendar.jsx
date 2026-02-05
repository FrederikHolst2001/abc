import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Bell, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LiveTicker from '@/components/forex/LiveTicker';
import EconomicCalendar from '@/components/forex/EconomicCalendar';
import MarketSummary from '@/components/forex/MarketSummary';
import UpgradePrompt from '@/components/forex/UpgradePrompt';

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUpcomingEvents();
    const interval = setInterval(fetchUpcomingEvents, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the next 3 upcoming high-impact economic events from the forex economic calendar for this week. Include major events like: NFP, FOMC meetings, ECB decisions, GDP releases, CPI data, interest rate decisions, etc.
        
        For each event provide:
        - event: name of the economic event
        - time: when it happens (format like "Today 14:00", "Tomorrow 08:30", "Wed 10:00", etc.)
        - currency: the currency code affected (USD, EUR, GBP, etc.)
        
        Make sure these are real upcoming events from reliable economic calendars.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  event: { type: "string" },
                  time: { type: "string" },
                  currency: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      if (response.events && response.events.length > 0) {
        setUpcomingEvents(response.events);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
    }
  };

  if (loading) return null;
  return (
    <div className="min-h-screen">
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Economic Calendar</h1>
            <p className="text-slate-400">Track market-moving events and their impact</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              <Bell className="w-4 h-4 mr-2" />
              Set Alerts
            </Button>
            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <EconomicCalendar />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Upcoming High Impact */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-rose-400" />
                Upcoming High Impact
              </h3>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <div className="text-sm text-white">{item.event}</div>
                        <div className="text-xs text-slate-500">{item.time}</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{item.currency}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    Loading events...
                  </div>
                )}
              </div>
            </div>

            {/* Market Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
              <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-slate-500">Events Today</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-rose-400">4</div>
                  <div className="text-xs text-slate-500">High Impact</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400">5</div>
                  <div className="text-xs text-slate-500">Medium Impact</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">3</div>
                  <div className="text-xs text-slate-500">Low Impact</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}