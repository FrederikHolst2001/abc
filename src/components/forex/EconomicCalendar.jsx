import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, AlertTriangle, AlertCircle, Info, ChevronDown, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const events = [
  { id: 1, time: '08:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'high', forecast: '180K', previous: '175K', actual: null },
  { id: 2, time: '10:00', currency: 'EUR', event: 'ECB Interest Rate Decision', impact: 'high', forecast: '4.50%', previous: '4.50%', actual: null },
  { id: 3, time: '12:30', currency: 'GBP', event: 'GDP (QoQ)', impact: 'medium', forecast: '0.3%', previous: '0.1%', actual: '0.4%' },
  { id: 4, time: '14:00', currency: 'USD', event: 'ISM Manufacturing PMI', impact: 'high', forecast: '49.5', previous: '48.7', actual: null },
  { id: 5, time: '15:30', currency: 'CAD', event: 'Employment Change', impact: 'medium', forecast: '15.0K', previous: '12.5K', actual: null },
  { id: 6, time: '17:00', currency: 'JPY', event: 'BoJ Monetary Policy Statement', impact: 'high', forecast: '-', previous: '-', actual: null },
  { id: 7, time: '19:00', currency: 'AUD', event: 'Trade Balance', impact: 'low', forecast: '5.5B', previous: '5.2B', actual: null },
  { id: 8, time: '21:00', currency: 'NZD', event: 'RBNZ Rate Statement', impact: 'medium', forecast: '-', previous: '-', actual: null },
];

const currencyFlags = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  NZD: '🇳🇿',
  CHF: '🇨🇭',
};

const impactConfig = {
  high: { color: 'bg-rose-500', icon: AlertTriangle, label: 'High Impact' },
  medium: { color: 'bg-amber-500', icon: AlertCircle, label: 'Medium Impact' },
  low: { color: 'bg-blue-500', icon: Info, label: 'Low Impact' },
};

export default function EconomicCalendar() {
  const [filter, setFilter] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveEvents();
  }, []);

  const fetchLiveEvents = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Search for TODAY'S actual economic calendar events from ForexFactory.com, Investing.com, or FXStreet for Saturday, January 25, 2026.
        
        Find the REAL scheduled economic releases happening today. Check the actual forex economic calendars to see what events are scheduled.
        
        If today is a weekend or there are fewer events, include upcoming events from the next few trading days. Include 8 total events.
        
        For each REAL scheduled event provide:
        - time: actual release time in HH:MM format (GMT/UTC timezone)
        - currency: currency code affected (USD, EUR, GBP, JPY, CAD, AUD, NZD, CHF)
        - event: exact event name from the calendar (Non-Farm Payrolls, CPI, GDP, PMI, Interest Rate Decision, etc.)
        - impact: real impact rating [high, medium, low] based on the calendar
        - forecast: actual forecast value from economists (include units like %, K, B)
        - previous: actual previous value from last release
        - actual: null if not released yet, or real value if already released
        
        Make sure these match REAL events from economic calendars, not fictional data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  time: { type: "string" },
                  currency: { type: "string" },
                  event: { type: "string" },
                  impact: { type: "string" },
                  forecast: { type: "string" },
                  previous: { type: "string" },
                  actual: { type: ["string", "null"] }
                }
              }
            }
          }
        }
      });
      
      const eventsWithIds = response.events.map((event, index) => ({
        ...event,
        id: index + 1
      }));
      
      setLiveEvents(eventsWithIds);
    } catch (error) {
      console.error('Failed to fetch live events:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventsToDisplay = liveEvents.length > 0 ? liveEvents : events;
  
  const filteredEvents = eventsToDisplay.filter(event => 
    filter === 'all' || event.impact === filter
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Economic Calendar</h2>
            {liveEvents.length > 0 && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex gap-1">
            {['all', 'high', 'medium', 'low'].map((level) => (
              <Button
                key={level}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(level)}
                className={`text-xs px-3 py-1 h-7 rounded-full transition-all ${
                  filter === level
                    ? level === 'high' ? 'bg-rose-500/20 text-rose-400' :
                      level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      level === 'low' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {filteredEvents.map((event) => {
            const config = impactConfig[event.impact];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-slate-700/20 transition-colors"
              >
                <div
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono text-slate-400 w-12">{event.time}</div>
                    
                    <div className={`w-1.5 h-8 rounded-full ${config.color}`} />
                    
                    <div className="flex items-center gap-2 w-16">
                      <span className="text-lg">{currencyFlags[event.currency]}</span>
                      <span className="text-sm font-medium text-slate-300">{event.currency}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{event.event}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon className="w-3 h-3" style={{ color: config.color.replace('bg-', '').includes('rose') ? '#f43f5e' : config.color.includes('amber') ? '#f59e0b' : '#3b82f6' }} />
                        <span className="text-xs text-slate-500">{config.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Forecast</div>
                        <div className="font-mono text-slate-300">{event.forecast}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Previous</div>
                        <div className="font-mono text-slate-400">{event.previous}</div>
                      </div>
                      <div className="text-center w-16">
                        <div className="text-xs text-slate-500 mb-1">Actual</div>
                        <div className={`font-mono ${event.actual ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {event.actual || '—'}
                        </div>
                      </div>
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedEvent === event.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedEvent === event.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-slate-900/50 rounded-lg p-4 ml-16">
                          <p className="text-sm text-slate-400">
                            This economic indicator measures the change in {event.event.toLowerCase()}. 
                            A reading above forecast is typically bullish for {event.currency}, while below is bearish.
                          </p>
                          <div className="flex gap-4 mt-3">
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              Volatility Expected
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              Market Moving
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}