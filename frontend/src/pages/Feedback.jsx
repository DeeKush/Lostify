import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('https://lostify-sst.onrender.com/feedback');
      setFeedback(response.data);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://lostify-sst.onrender.com/feedback/${id}`, { status });
      toast.success('Status updated successfully');
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await axios.delete(`https://lostify-sst.onrender.com/feedback/${id}`);
      toast.success('Feedback deleted successfully');
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  const filteredFeedback = filter === 'all' 
    ? feedback 
    : feedback.filter(f => f.status.toLowerCase() === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-8">
          Feedback & Bugs
        </h1>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-heading font-semibold transition-all ${
              filter === 'all'
                ? 'bg-navy text-white shadow-md'
                : 'bg-white dark:bg-navy text-charcoal dark:text-white border border-charcoal/20 dark:border-white/20'
            }`}
          >
            All ({feedback.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-heading font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-accent text-navy shadow-md'
                : 'bg-white dark:bg-navy text-charcoal dark:text-white border border-charcoal/20 dark:border-white/20'
            }`}
          >
            Pending ({feedback.filter(f => f.status === 'Pending').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg font-heading font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-found text-white shadow-md'
                : 'bg-white dark:bg-navy text-charcoal dark:text-white border border-charcoal/20 dark:border-white/20'
            }`}
          >
            Resolved ({feedback.filter(f => f.status === 'Resolved').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-center py-16 card">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-heading font-semibold text-charcoal dark:text-white mb-2">
              No feedback yet
            </h3>
            <p className="text-charcoal/60 dark:text-white/60">
              Feedback from users will appear here
            </p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal/10 dark:border-white/10">
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Name</th>
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Email</th>
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Subject</th>
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Message</th>
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Date</th>
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Status</th>
                  <th className="text-left p-4 font-heading font-semibold text-charcoal dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-charcoal/10 dark:border-white/10 hover:bg-charcoal/5 dark:hover:bg-white/5"
                  >
                    <td className="p-4 text-charcoal dark:text-white">{item.name}</td>
                    <td className="p-4 text-charcoal dark:text-white text-sm">{item.email}</td>
                    <td className="p-4 text-charcoal dark:text-white">{item.subject}</td>
                    <td className="p-4 text-charcoal dark:text-white max-w-xs truncate" title={item.message}>
                      {item.message}
                    </td>
                    <td className="p-4 text-charcoal/60 dark:text-white/60 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Pending'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-found/20 text-found'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {item.status === 'Pending' ? (
                          <button
                            onClick={() => updateStatus(item.id, 'Resolved')}
                            className="px-3 py-1 bg-found text-white rounded text-sm hover:bg-found/90 transition-colors"
                          >
                            Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(item.id, 'Pending')}
                            className="px-3 py-1 bg-accent text-navy rounded text-sm hover:bg-accent/90 transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => deleteFeedback(item.id)}
                          className="px-3 py-1 bg-lost text-white rounded text-sm hover:bg-lost/90 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
