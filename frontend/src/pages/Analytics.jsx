import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    lostPosts: 0,
    foundPosts: 0,
    resolvedPosts: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get('https://lostify-sst.onrender.com/admin/analytics', { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError(true);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setTimeout(loadAnalytics, 300);
  };

  const postTypeData = {
    labels: ['Lost', 'Found'],
    datasets: [
      {
        data: [stats.lostPosts, stats.foundPosts],
        backgroundColor: ['#EF4444', '#10B981'],
        borderColor: ['#EF4444', '#10B981'],
        borderWidth: 2,
      },
    ],
  };

  const statusData = {
    labels: ['Active', 'Resolved'],
    datasets: [
      {
        label: 'Posts',
        data: [stats.totalPosts - stats.resolvedPosts, stats.resolvedPosts],
        backgroundColor: ['#F8C538', '#10B981'],
        borderColor: ['#F8C538', '#10B981'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-8">
          Analytics Dashboard
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-charcoal/70 dark:text-white/70">Loading analytics...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto card p-8">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-2">
                Failed to load analytics data
              </h3>
              <p className="text-charcoal/70 dark:text-white/70 mb-6">
                Unable to fetch analytics. Please try again.
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Posts', value: stats.totalPosts, icon: '📝' },
            { label: 'Lost Items', value: stats.lostPosts, icon: '🔍' },
            { label: 'Found Items', value: stats.foundPosts, icon: '✓' },
            { label: 'Active Users', value: stats.activeUsers, icon: '👥' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-charcoal/60 dark:text-white/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-heading font-bold text-charcoal dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
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
            <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
              Lost vs Found Items
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Pie data={postTypeData} options={{ maintainAspectRatio: false }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-4">
              Post Status
            </h2>
            <div className="h-64">
              <Bar data={statusData} options={{ maintainAspectRatio: false }} />
            </div>
          </motion.div>
        </div>
        </>
        )}
      </motion.div>
    </div>
  );
}
