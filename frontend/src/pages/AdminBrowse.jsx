import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingNote, setEditingNote] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        axios.get('https://lostify-x7te.onrender.com//api/posts/stats/admin'),
        axios.get('https://lostify-x7te.onrender.com//api/posts/admin/all')
      ]);
      setStats(statsRes.data);
      setPosts(postsRes.data);
      toast.success('Data loaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`https://lostify-x7te.onrender.com//api/posts/${id}`);
      toast.success('Post deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleFlag = async (id) => {
    try {
      await axios.patch(`https://lostify-x7te.onrender.com//api/posts/admin/${id}`, { status: 'flagged' });
      toast.success('Post flagged successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to flag post');
    }
  };

  const handleSaveNote = async (id) => {
    try {
      await axios.patch(`https://lostify-x7te.onrender.com//api/posts/admin/${id}`, { adminNote });
      toast.success('Admin note saved');
      setEditingNote(null);
      setAdminNote('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save note');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('https://lostify-x7te.onrender.com//api/posts/export/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lostify-posts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  const categoryData = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: ['Lost Items', 'Found Items'],
    datasets: [{
      data: [stats.lostPosts, stats.foundPosts],
      backgroundColor: ['#EF4444', '#10B981'],
      borderWidth: 2
    }]
  };

  const barChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: 'Posts by Category',
      data: Object.values(categoryData),
      backgroundColor: '#1E2A45'
    }]
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return post.status === 'flagged';
    if (filter === 'active') return post.status === 'active';
    if (filter === 'resolved') return post.status === 'resolved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white">Admin Dashboard</h1>
        <button
          onClick={handleExportCSV}
          className="bg-found text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 font-heading font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-charcoal/60 dark:text-white/60 text-sm">Total Posts</p>
          <p className="text-3xl font-heading font-bold text-navy dark:text-accent">{stats.totalPosts}</p>
        </div>
        <div className="card p-6">
          <p className="text-charcoal/60 dark:text-white/60 text-sm">Active Posts</p>
          <p className="text-3xl font-heading font-bold text-found">{stats.activePosts}</p>
        </div>
        <div className="card p-6">
          <p className="text-charcoal/60 dark:text-white/60 text-sm">Resolved</p>
          <p className="text-3xl font-heading font-bold text-charcoal/70 dark:text-white/80">{stats.resolvedPosts}</p>
        </div>
        <div className="card p-6">
          <p className="text-charcoal/60 dark:text-white/60 text-sm">Lost Items</p>
          <p className="text-3xl font-heading font-bold text-lost">{stats.lostPosts}</p>
        </div>
        <div className="card p-6">
          <p className="text-charcoal/60 dark:text-white/60 text-sm">Found Items</p>
          <p className="text-3xl font-heading font-bold text-accent">{stats.foundPosts}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-heading font-semibold text-charcoal dark:text-white mb-4">Lost vs Found Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-heading font-semibold text-charcoal dark:text-white mb-4">Posts by Category</h3>
          <div className="h-64">
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-charcoal/20 dark:border-white/20 flex justify-between items-center">
          <h2 className="text-xl font-heading font-semibold text-charcoal dark:text-white">All Posts</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-heading font-semibold transition-all ${
                filter === 'all' ? 'bg-navy text-white shadow-md' : 'bg-lightGray dark:bg-navy text-charcoal dark:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-heading font-semibold transition-all ${
                filter === 'active' ? 'bg-navy text-white shadow-md' : 'bg-lightGray dark:bg-navy text-charcoal dark:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 rounded-lg font-heading font-semibold transition-all ${
                filter === 'flagged' ? 'bg-navy text-white shadow-md' : 'bg-lightGray dark:bg-navy text-charcoal dark:text-white'
              }`}
            >
              Flagged
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg font-heading font-semibold transition-all ${
                filter === 'resolved' ? 'bg-navy text-white shadow-md' : 'bg-lightGray dark:bg-navy text-charcoal dark:text-white'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-charcoal/20 dark:divide-white/20">
            <thead className="bg-lightGray dark:bg-navy">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase">Note</th>
                <th className="px-6 py-3 text-left text-xs font-heading font-semibold text-charcoal dark:text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-navy divide-y divide-charcoal/20 dark:divide-white/20">
              {filteredPosts.map((post) => (
                <tr key={post.id} className={post.status === 'flagged' ? 'bg-lost/10' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-charcoal dark:text-white">
                    {post.title}
                    {post.adminNote && (
                      <p className="text-xs text-charcoal/60 dark:text-white/60 mt-1">Note: {post.adminNote}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      post.type === 'lost' ? 'bg-lost text-white' : 'bg-found text-white'
                    }`}>
                      {post.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal/70 dark:text-white/80">{post.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      post.status === 'active' ? 'bg-found text-white' : 
                      post.status === 'flagged' ? 'bg-lost text-white' :
                      'bg-charcoal/60 text-white'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingNote === post.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          className="input-field w-32 text-sm"
                          placeholder="Add note..."
                        />
                        <button
                          onClick={() => handleSaveNote(post.id)}
                          className="text-found hover:text-green-700 text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setAdminNote('');
                          }}
                          className="text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingNote(post.id);
                          setAdminNote(post.adminNote || '');
                        }}
                        className="text-navy dark:text-accent hover:text-accent/80 text-xs font-semibold"
                      >
                        {post.adminNote ? 'Edit' : 'Add'} Note
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                    {post.status !== 'flagged' && (
                      <button
                        onClick={() => handleFlag(post.id)}
                        className="text-accent hover:text-accent/80 font-semibold"
                      >
                        Flag
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-lost hover:text-lost/80 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
