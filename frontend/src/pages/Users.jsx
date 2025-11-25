import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post('https://lostify-x7te.onrender.com/api/auth/google/getall', { withCredentials: true , type: 'admin'});
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError(true);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setTimeout(loadUsers, 300);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`https://lostify-x7te.onrender.com/api/admin/users/${userId}/status`, {
        enabled: !currentStatus,
      }, { withCredentials: true });
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-8">
          User Management
        </h1>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-accent border-t-transparent mb-3"></div>
              <p className="text-charcoal/70 dark:text-white/70">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-2">
                Failed to load users
              </h3>
              <p className="text-charcoal/70 dark:text-white/70 mb-6">
                Unable to fetch user list. Please try again.
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
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-charcoal/70 dark:text-white/70">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-charcoal/10 dark:divide-white/10">
                <thead className="bg-lightGray dark:bg-navy">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-charcoal divide-y divide-charcoal/10 dark:divide-white/10">
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgba(248, 197, 56, 0.05)' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-charcoal dark:text-white">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-charcoal/70 dark:text-white/70">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin
                              ? 'bg-accent/20 text-accent'
                              : 'bg-charcoal/10 dark:bg-white/10 text-charcoal dark:text-white'
                          }`}
                        >
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.enabled !== false
                              ? 'bg-found/20 text-found'
                              : 'bg-lost/20 text-lost'
                          }`}
                        >
                          {user.enabled !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.enabled !== false)}
                          className="text-accent hover:text-accent/80 font-semibold"
                        >
                          {user.enabled !== false ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
