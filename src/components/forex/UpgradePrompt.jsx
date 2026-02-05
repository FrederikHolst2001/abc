import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UpgradePrompt({ feature }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            Premium Feature
          </h2>
          
          <p className="text-slate-400 mb-8">
            {feature} is available to Professional subscribers. 
            Upgrade your account to unlock this feature and access the full platform.
          </p>
          
          <div className="space-y-3">
            <Link to={createPageUrl('Subscription')}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-slate-700">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}