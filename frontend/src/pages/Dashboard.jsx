import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PostCard from '../components/PostCard';
import FilterPanel from '../components/FilterPanel';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    location: '',
    dateFrom: '',
    dateTo: '',
    status: 'all',
    user: '',
    hasImage: false,
    sortBy: 'newest'
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters, search]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (user?.isAdmin && filters.status !== 'all') params.status = filters.status;
      if (user?.isAdmin && filters.user) params.user = filters.user;
      if (user?.isAdmin && filters.hasImage) params.hasImage = 'true';
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (search) params.search = search;
      
      const response = await axios.get('https://lostify-sst.onrender.com/posts', { params });
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      location: '',
      dateFrom: '',
      dateTo: '',
      status: 'all',
      user: '',
      hasImage: false,
      sortBy: 'newest'
    });
    setSearch('');
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-heading font-bold text-charcoal dark:text-white mb-6 sm:mb-8"
        >
          Browse Items
        </motion.h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
              isAdmin={user?.isAdmin}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="md:hidden mb-6">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
                isAdmin={user?.isAdmin}
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-16 card p-6 sm:p-8"
              >
                <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-charcoal dark:text-white mb-2">
                  No items found
                </h3>
                <p className="text-charcoal/60 dark:text-white/60 mb-6 px-4">
                  {search || Object.values(filters).some(v => v && v !== 'all' && v !== 'newest' && v !== false)
                    ? 'Try adjusting your search or filters' 
                    : 'Be the first to post an item!'}
                </p>
                <Link to="/create" className="btn-primary inline-flex">
                  Post Your First Item
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

