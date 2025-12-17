import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('https://lostify-sst.onrender.com/posts/my-matches');
      setMatches(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal dark:text-white">
            My Matches
          </h1>
          <p className="mt-2 text-sm sm:text-base text-charcoal/70 dark:text-white/80">
            Items that may match your lost or found posts based on similarity
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="card p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-heading font-semibold text-charcoal dark:text-white mb-2">
              No Matches Found
            </h3>
            <p className="text-sm sm:text-base text-charcoal/70 dark:text-white/80 px-4">
              We haven't found any potential matches for your items yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 w-full">
            {matches.map((match, index) => (
              <div key={index} className="card overflow-hidden fade-in">
                <div className="bg-gradient-to-r from-navy to-accent px-4 sm:px-6 py-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <h3 className="text-white font-heading font-semibold text-sm sm:text-base">
                      Match Score: {match.scorePercentage}%
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
                      match.scorePercentage >= 70 
                        ? 'bg-found text-white' 
                        : match.scorePercentage >= 50 
                        ? 'bg-accent text-navy' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {match.scorePercentage >= 70 ? 'High' : match.scorePercentage >= 50 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:border-r border-charcoal/20 dark:border-white/20 md:pr-6 pb-6 md:pb-0 border-b md:border-b-0">
                      <div className="mb-3">
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          match.userPost.type === 'lost' ? 'bg-lost text-white' : 'bg-found text-white'
                        }`}>
                          Your {match.userPost.type === 'lost' ? 'Lost' : 'Found'} Item
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-heading font-bold text-charcoal dark:text-white mb-2 break-words">
                        {match.userPost.title}
                      </h4>
                      <p className="text-sm sm:text-base text-charcoal/70 dark:text-white/80 mb-3 break-words">
                        {match.userPost.description}
                      </p>
                      <div className="space-y-1 text-xs sm:text-sm text-charcoal/60 dark:text-white/60">
                        <p className="break-words"><strong>Category:</strong> {match.userPost.category}</p>
                        <p className="break-words"><strong>Location:</strong> {match.userPost.location}</p>
                        <p><strong>Date:</strong> {new Date(match.userPost.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="md:pl-6">
                      <div className="mb-3">
                        <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          match.matchedPost.type === 'lost' ? 'bg-lost text-white' : 'bg-found text-white'
                        }`}>
                          Matched {match.matchedPost.type === 'lost' ? 'Lost' : 'Found'} Item
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-heading font-bold text-charcoal dark:text-white mb-2 break-words">
                        {match.matchedPost.title}
                      </h4>
                      <p className="text-sm sm:text-base text-charcoal/70 dark:text-white/80 mb-3 break-words">
                        {match.matchedPost.description}
                      </p>
                      <div className="space-y-1 text-xs sm:text-sm text-charcoal/60 dark:text-white/60">
                        <p className="break-words"><strong>Category:</strong> {match.matchedPost.category}</p>
                        <p className="break-words"><strong>Location:</strong> {match.matchedPost.location}</p>
                        <p><strong>Date:</strong> {new Date(match.matchedPost.date).toLocaleDateString()}</p>
                        <p className="break-words"><strong>Contact:</strong> {match.matchedPost.contactInfo}</p>
                        <p className="break-words"><strong>Posted by:</strong> {match.matchedPost.username.split('.')[0].replace(/^./, c => c.toUpperCase())}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-charcoal/20 dark:border-white/20">
                    <p className="text-xs sm:text-sm text-charcoal/70 dark:text-white/80 mb-3">
                      <strong>Why this matches:</strong> This item has similar title, description, category, and location to your post.
                    </p>
                    <a
                      href={`tel:${match.matchedPost.contactInfo}`}
                      className="btn-primary inline-flex"
                    >
                      Contact {match.matchedPost.username.split('.')[0].replace(/^./, c => c.toUpperCase())}
                    </a>
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
