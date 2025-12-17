import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Settings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [userSettings, setUserSettings] = useState({
    defaultPostType: 'lost',
    contactVisibility: 'public',
    whatsappPrefix: true,
    autoResolve: false,
  });
  const [adminSettings, setAdminSettings] = useState({
    moderationThreshold: 3,
    manualApproval: false,
    announcementBanner: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userResponse = await axios.get('https://lostify-sst.onrender.com/settings');
      setUserSettings({ ...userSettings, ...userResponse.data });

      if (user?.isAdmin) {
        const adminResponse = await axios.get('https://lostify-sst.onrender.com/settings/admin');
        setAdminSettings({ ...adminSettings, ...adminResponse.data });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveUserSettings = async () => {
    setLoading(true);
    try {
      await axios.put('https://lostify-sst.onrender.com/settings', userSettings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const saveAdminSettings = async () => {
    setLoading(true);
    try {
      await axios.put('https://lostify-sst.onrender.com/settings/admin', adminSettings);
      toast.success('Admin settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save admin settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllSessions = () => {
    if (confirm('This will log you out of all devices. Continue?')) {
      logout();
      toast.success('Logged out from all sessions');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    ...(user?.isAdmin ? [{ id: 'admin', name: 'Admin', icon: '⚡' }] : []),
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-8">
          Settings
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="card p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all mb-1 ${
                    activeTab === tab.id
                      ? 'bg-accent text-navy'
                      : 'text-charcoal dark:text-white hover:bg-lightGray dark:hover:bg-navy/50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
                    Profile Information
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="input-field bg-lightGray/50 dark:bg-navy/50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input-field bg-lightGray/50 dark:bg-navy/50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Domain Verification
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2 bg-found/10 text-found rounded-lg text-sm font-semibold">
                        ✓ Verified @sst.scaler.com
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
                    User Preferences
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Dark Mode
                    </label>
                    <button
                      onClick={toggleTheme}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isDark ? 'bg-accent text-navy' : 'bg-navy text-white'
                      }`}
                    >
                      {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Default Post Type
                    </label>
                    <select
                      value={userSettings.defaultPostType}
                      onChange={(e) =>
                        setUserSettings({ ...userSettings, defaultPostType: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Contact Visibility
                    </label>
                    <select
                      value={userSettings.contactVisibility}
                      onChange={(e) =>
                        setUserSettings({ ...userSettings, contactVisibility: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="public">Public (all verified users)</option>
                      <option value="verified">Verified SST students only</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="whatsappPrefix"
                      checked={userSettings.whatsappPrefix}
                      onChange={(e) =>
                        setUserSettings({ ...userSettings, whatsappPrefix: e.target.checked })
                      }
                      className="w-5 h-5 text-accent focus:ring-accent rounded"
                    />
                    <label htmlFor="whatsappPrefix" className="text-sm text-charcoal dark:text-white">
                      Auto-add "+91" prefix for WhatsApp contact
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="autoResolve"
                      checked={userSettings.autoResolve}
                      onChange={(e) =>
                        setUserSettings({ ...userSettings, autoResolve: e.target.checked })
                      }
                      className="w-5 h-5 text-accent focus:ring-accent rounded"
                    />
                    <label htmlFor="autoResolve" className="text-sm text-charcoal dark:text-white">
                      Auto-resolve item after successful return
                    </label>
                  </div>

                  <button onClick={saveUserSettings} disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
                    Account Security
                  </h2>
                  
                  <div className="border border-charcoal/20 dark:border-white/20 rounded-lg p-4">
                    <h3 className="font-semibold text-charcoal dark:text-white mb-2">
                      Active Sessions
                    </h3>
                    <p className="text-sm text-charcoal/70 dark:text-white/70 mb-4">
                      Manage all active sessions across devices
                    </p>
                    <button
                      onClick={handleLogoutAllSessions}
                      className="px-4 py-2 bg-lost text-white rounded-lg font-semibold hover:bg-lost/90 transition-all"
                    >
                      Logout All Sessions
                    </button>
                  </div>

                  <div className="border border-charcoal/20 dark:border-white/20 rounded-lg p-4">
                    <h3 className="font-semibold text-charcoal dark:text-white mb-2">
                      Notification Preferences
                    </h3>
                    <p className="text-sm text-charcoal/70 dark:text-white/70">
                      Email notifications for matches and updates (Coming Soon)
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && user?.isAdmin && (
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
                    Admin Settings
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Moderation Threshold (Reports to auto-flag)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={adminSettings.moderationThreshold}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          moderationThreshold: parseInt(e.target.value),
                        })
                      }
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="manualApproval"
                      checked={adminSettings.manualApproval}
                      onChange={(e) =>
                        setAdminSettings({ ...adminSettings, manualApproval: e.target.checked })
                      }
                      className="w-5 h-5 text-accent focus:ring-accent rounded"
                    />
                    <label htmlFor="manualApproval" className="text-sm text-charcoal dark:text-white">
                      Require manual approval for all new posts
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Announcement Banner
                    </label>
                    <textarea
                      value={adminSettings.announcementBanner}
                      onChange={(e) =>
                        setAdminSettings({ ...adminSettings, announcementBanner: e.target.value })
                      }
                      className="input-field"
                      rows="3"
                      placeholder="Enter announcement text to display site-wide..."
                    />
                  </div>

                  <button onClick={saveAdminSettings} disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : 'Save Admin Settings'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
