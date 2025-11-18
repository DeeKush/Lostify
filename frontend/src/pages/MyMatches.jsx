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
      const response = await axios.get('https://lostify-x7te.onrender.com/api/posts/my-matches');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white">My Matches</h1>
        <p className="mt-2 text-charcoal/70 dark:text-white/80">
          Items that may match your lost or found posts based on similarity
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-heading font-semibold text-charcoal dark:text-white mb-2">No Matches Found</h3>
          <p className="text-charcoal/70 dark:text-white/80">
            We haven't found any potential matches for your items yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match, index) => (
            <div key={index} className="card overflow-hidden fade-in">
              <div className="bg-gradient-to-r from-navy to-accent px-6 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-heading font-semibold">Match Score: {match.scorePercentage}%</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-r border-charcoal/20 dark:border-white/20 pr-6">
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        match.userPost.type === 'lost' ? 'bg-lost text-white' : 'bg-found text-white'
                      }`}>
                        Your {match.userPost.type === 'lost' ? 'Lost' : 'Found'} Item
                      </span>
                    </div>
                    <h4 className="text-xl font-heading font-bold text-charcoal dark:text-white mb-2">{match.userPost.title}</h4>
                    <p className="text-charcoal/70 dark:text-white/80 mb-3">{match.userPost.description}</p>
                    <div className="space-y-1 text-sm text-charcoal/60 dark:text-white/60">
                      <p><strong>Category:</strong> {match.userPost.category}</p>
                      <p><strong>Location:</strong> {match.userPost.location}</p>
                      <p><strong>Date:</strong> {new Date(match.userPost.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="pl-6">
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        match.matchedPost.type === 'lost' ? 'bg-lost text-white' : 'bg-found text-white'
                      }`}>
                        Matched {match.matchedPost.type === 'lost' ? 'Lost' : 'Found'} Item
                      </span>
                    </div>
                    <h4 className="text-xl font-heading font-bold text-charcoal dark:text-white mb-2">{match.matchedPost.title}</h4>
                    <p className="text-charcoal/70 dark:text-white/80 mb-3">{match.matchedPost.description}</p>
                    <div className="space-y-1 text-sm text-charcoal/60 dark:text-white/60">
                      <p><strong>Category:</strong> {match.matchedPost.category}</p>
                      <p><strong>Location:</strong> {match.matchedPost.location}</p>
                      <p><strong>Date:</strong> {new Date(match.matchedPost.date).toLocaleDateString()}</p>
                      <p><strong>Contact:</strong> {match.matchedPost.contactInfo}</p>
                      <p><strong>Posted by:</strong> {match.matchedPost.username.split('.')[0]}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-charcoal/20 dark:border-white/20">
                  <p className="text-sm text-charcoal/70 dark:text-white/80 mb-3">
                    <strong>Why this matches:</strong> This item has similar title, description, category, and location to your post.
                  </p>
                  <a
                    href={`tel:${match.matchedPost.contactInfo}`}
                    className="btn-primary inline-block"
                  >
                    Contact {match.matchedPost.username.split('.')[0]}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
