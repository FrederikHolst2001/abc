import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveTicker from '@/components/forex/LiveTicker';
import TechnicalAnalysis from '@/components/forex/TechnicalAnalysis';
import TrendIndicator from '@/components/forex/TrendIndicator';
import CurrencyConverter from '@/components/forex/CurrencyConverter';
import UpgradePrompt from '@/components/forex/UpgradePrompt';

export default function Analysis() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  return (
    <div className="min-h-screen">
      <LiveTicker />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Technical Analysis</h1>
          <p className="text-slate-400">Advanced charting with indicators and automated analysis</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <TechnicalAnalysis />
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CurrencyConverter />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendIndicator />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}