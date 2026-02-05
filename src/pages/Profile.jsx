import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LiveTicker from '@/components/forex/LiveTicker';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setFormData({ full_name: userData.full_name, email: userData.email });
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({ full_name: formData.full_name });
      await loadUser();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <LiveTicker />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Profile Information</span>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="text-slate-400"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-400">Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                      <User className="w-5 h-5 text-slate-500" />
                      <span className="text-white">{user.full_name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400">Email Address</Label>
                  <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <span className="text-white">{user.email}</span>
                  </div>
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400">Account Role</Label>
                  <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                    <Shield className="w-5 h-5 text-slate-500" />
                    <Badge className={user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}>
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400">Member Since</Label>
                  <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="text-white">
                      {new Date(user.created_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-sm">Active</Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400 text-sm mb-2">Free Trial</div>
                <div className="text-2xl font-bold text-white mb-1">7 Days</div>
                <p className="text-xs text-slate-500">Remaining</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}