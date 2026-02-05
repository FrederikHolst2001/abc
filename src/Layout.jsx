import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import UserInitializer from '@/components/UserInitializer';
import {
  Home,
  BarChart3,
  Calendar,
  Zap,
  Newspaper,
  Menu,
  X,
  TrendingUp,
  Settings,
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
  { name: 'Dashboard', href: 'Home', icon: Home },
  { name: 'Analysis', href: 'Analysis', icon: BarChart3 },
  { name: 'Calendar', href: 'Calendar', icon: Calendar },
  { name: 'Signals', href: 'Signals', icon: Zap },
  { name: 'News', href: 'News', icon: Newspaper },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  React.useEffect(() => {
    // Load AdSense script
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3424983948330298';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <UserInitializer />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">ForexPro</span>
                <span className="text-xs text-slate-500 block -mt-1">Market Intelligence</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                  const isActive = currentPageName === item.href;
                  const isRestricted = item.href === 'Signals' && !user;

                  if (isRestricted) {
                    return null;
                  }
                
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.href)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Bell className="w-5 h-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                      <Link to={createPageUrl('Profile')}>
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link to={createPageUrl('Settings')}>
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <Link to={createPageUrl('Subscription')}>
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Subscription
                        </DropdownMenuItem>
                      </Link>
                      {user.subscription_plan === 'free' && (
                        <Link to={createPageUrl('Subscription')}>
                          <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-400" />
                              <div>
                                <div className="text-slate-300 font-medium">Upgrade to Pro</div>
                                <div className="text-xs text-slate-500">$19/month</div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem 
                        onSelect={(e) => {
                          e.preventDefault();
                          base44.auth.logout();
                        }}
                        className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = currentPageName === item.href;
                  const isRestricted = item.href === 'Signals' && !user;

                  if (isRestricted) {
                    return null;
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.href)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ForexPro</span>
              </div>
              <p className="text-sm text-slate-500">
                Professional forex trading intelligence platform.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to={createPageUrl('Analysis')} className="hover:text-white transition-colors">Analysis</Link></li>
                <li><Link to={createPageUrl('Signals')} className="hover:text-white transition-colors">Signals</Link></li>
                <li><Link to={createPageUrl('Calendar')} className="hover:text-white transition-colors">Calendar</Link></li>
                <li><Link to={createPageUrl('News')} className="hover:text-white transition-colors">News</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © 2024 ForexPro. All rights reserved. Trading involves risk.
            </p>
            <p className="text-xs text-slate-600">
              Data provided for informational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}