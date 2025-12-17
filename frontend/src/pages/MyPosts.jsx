import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get('https://lostify-sst.onrender.com/posts/my-posts');
      setPosts(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`https://lostify-sst.onrender.com/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.put(`https://lostify-sst.onrender.com/posts/${id}`, { status: 'resolved' });
      toast.success('Post marked as resolved');
      fetchMyPosts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resolve post');
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal dark:text-white mb-6 sm:mb-8">
          My Posts
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 card">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-charcoal dark:text-white mb-2">
              No Posts Yet
            </h3>
            <p className="text-charcoal/60 dark:text-white/60 mb-6 px-4">
              You haven't posted anything yet. Start by posting a lost or found item!
            </p>
            <Link to="/create" className="btn-primary inline-block">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {posts.map((post) => (
              <div key={post.id} className="card p-4 sm:p-6 fade-in w-full overflow-hidden">
                <div className="flex flex-col gap-4 w-full">
                  {/* Content Section */}
                  <div className="flex-1 min-w-0 w-full">
                    {/* Title and Badges - Mobile Responsive */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-heading font-semibold text-charcoal dark:text-white break-words">
                        {post.title}
                      </h3>
                      <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        post.type === 'lost' ? 'bg-lost text-white' : 'bg-found text-white'
                      }`}>
                        {post.type.toUpperCase()}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        post.status === 'active' ? 'bg-accent text-navy' : 'bg-charcoal/60 text-white'
                      }`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-charcoal/70 dark:text-white/80 mb-3 break-words">
                      {post.description}
                    </p>

                    {/* Post Details */}
                    <div className="text-xs sm:text-sm text-charcoal/60 dark:text-white/60 space-y-1">
                      <p className="break-words">📍 {post.location}</p>
                      <p className="break-words">📂 {post.category}</p>
                      <p className="break-words">📞 {post.contactInfo}</p>
                    </div>
                  </div>

                  {/* Action Buttons - Stack on Mobile */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:self-end">
                    {post.status === 'active' && (
                      <button
                        onClick={() => handleResolve(post.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-found text-white rounded-lg hover:bg-green-600 text-xs sm:text-sm font-heading font-semibold transition-all whitespace-nowrap"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-lost text-white rounded-lg hover:bg-lost/90 text-xs sm:text-sm font-heading font-semibold transition-all whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
