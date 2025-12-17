import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activePosts: 0,
    resolvedPosts: 0,
    totalFeedback: 0,
    lostCount: 0,
    foundCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get('https://lostify-sst.onrender.com/admin/analytics', { withCredentials: true });
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
      setError(true);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setTimeout(fetchMetrics, 300);
  };

  const cards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500'
    },
    {
      title: 'Active Posts',
      value: metrics.activePosts,
      icon: '📦',
      color: 'from-accent to-yellow-500',
      bgColor: 'bg-accent/10 dark:bg-accent/20',
      borderColor: 'border-accent'
    },
    {
      title: 'Resolved Items',
      value: metrics.resolvedPosts,
      icon: '✅',
      color: 'from-found to-green-600',
      bgColor: 'bg-found/10 dark:bg-found/20',
      borderColor: 'border-found'
    },
    {
      title: 'Feedback Reports',
      value: metrics.totalFeedback,
      icon: '💬',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-charcoal/70 dark:text-white/70">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto card p-8">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-2">
                Failed to load dashboard data
              </h3>
              <p className="text-charcoal/70 dark:text-white/70 mb-6">
                Unable to fetch dashboard metrics. Please try again.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="btn-primary"
              >
                Retry
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`card ${card.bgColor} border-l-4 ${card.borderColor} p-6`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{card.icon}</div>
                    <div className={`text-3xl font-heading font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.value}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-charcoal/70 dark:text-white/70 uppercase tracking-wide">
                    {card.title}
                  </h3>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-charcoal/10 dark:border-white/10">
                    <span className="text-charcoal/70 dark:text-white/70">Lost Items</span>
                    <span className="font-semibold text-lost">{metrics.lostCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-charcoal/10 dark:border-white/10">
                    <span className="text-charcoal/70 dark:text-white/70">Found Items</span>
                    <span className="font-semibold text-found">{metrics.foundCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-charcoal/70 dark:text-white/70">Resolution Rate</span>
                    <span className="font-semibold text-accent">
                      {metrics.totalPosts > 0 
                        ? Math.round((metrics.resolvedPosts / (metrics.activePosts + metrics.resolvedPosts)) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
                  Platform Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-navy dark:bg-accent/20 rounded-full flex items-center justify-center text-xl">
                      📊
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/70 dark:text-white/70">Total Posts</p>
                      <p className="text-lg font-semibold text-charcoal dark:text-white">
                        {metrics.activePosts + metrics.resolvedPosts}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-navy dark:bg-accent/20 rounded-full flex items-center justify-center text-xl">
                      ⚡
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/70 dark:text-white/70">Active Community</p>
                      <p className="text-lg font-semibold text-charcoal dark:text-white">
                        {metrics.totalUsers} Students
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
