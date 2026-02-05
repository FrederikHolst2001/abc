import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Moon, Globe, Lock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LiveTicker from '@/components/forex/LiveTicker';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    priceAlerts: true,
    newsAlerts: false,
    darkMode: true,
    language: 'en',
    timezone: 'UTC',
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success('Settings updated');
  };

  const handleSelectChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    toast.success('Settings updated');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <LiveTicker />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-400" />
            Settings
          </h1>
          <p className="text-slate-400">Manage your preferences and account settings</p>
        </motion.div>

        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Price Alerts</Label>
                    <p className="text-sm text-slate-500">Get notified when prices reach targets</p>
                  </div>
                  <Switch
                    checked={settings.priceAlerts}
                    onCheckedChange={() => handleToggle('priceAlerts')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">News Alerts</Label>
                    <p className="text-sm text-slate-500">Breaking news notifications</p>
                  </div>
                  <Switch
                    checked={settings.newsAlerts}
                    onCheckedChange={() => handleToggle('newsAlerts')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Moon className="w-5 h-5 text-purple-400" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Dark Mode</Label>
                    <p className="text-sm text-slate-500">Use dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={() => handleToggle('darkMode')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="en" className="text-white">English</SelectItem>
                      <SelectItem value="es" className="text-white">Spanish</SelectItem>
                      <SelectItem value="fr" className="text-white">French</SelectItem>
                      <SelectItem value="de" className="text-white">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleSelectChange('timezone', value)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                      <SelectItem value="EST" className="text-white">EST</SelectItem>
                      <SelectItem value="PST" className="text-white">PST</SelectItem>
                      <SelectItem value="GMT" className="text-white">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-400" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Password</Label>
                  <p className="text-sm text-slate-500 mb-2">Last changed 3 months ago</p>
                  <button className="text-sm text-blue-400 hover:text-blue-300">Change Password</button>
                </div>

                <div>
                  <Label className="text-white">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500 mb-2">Add an extra layer of security</p>
                  <button className="text-sm text-blue-400 hover:text-blue-300">Enable 2FA</button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}