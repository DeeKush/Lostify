import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/lostify-logo.jpg';

export default function Login() {
  const [activeTab, setActiveTab] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(username, password);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome to Lostify!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      toast.error(errorMsg);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Lostify Logo"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-heading font-bold text-charcoal dark:text-white">
            Welcome to Lostify
          </h2>
          <p className="mt-2 text-sm text-charcoal/60 dark:text-white/60">
            {activeTab === 'user' 
              ? 'Sign in with your SST Google account' 
              : 'Admin portal access'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex border-b border-charcoal/20 dark:border-white/20 mb-6">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-3 text-center font-heading font-semibold transition-all ${
                activeTab === 'user'
                  ? 'border-b-2 border-accent text-navy dark:text-accent'
                  : 'text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white'
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 text-center font-heading font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'border-b-2 border-accent text-navy dark:text-accent'
                  : 'text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white'
              }`}
            >
              Admin Login
            </button>
          </div>

          {activeTab === 'user' ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              <p className="text-sm text-center text-charcoal/60 dark:text-white/60">
                Only @sst.scaler.com email addresses are allowed
              </p>

              <p className="text-xs text-center text-charcoal/50 dark:text-white/50">
                New to Lostify? Your account will be created automatically when you sign in
              </p>

              <div className="text-center">
                <Link to="/" className="text-navy dark:text-accent hover:text-accent/80 font-medium transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleAdminSubmit}>
              {error && (
                <div className="bg-lost/10 border border-lost text-lost px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="Admin Username"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Admin Password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in as Admin'}
              </button>

              <div className="text-center">
                <Link to="/" className="text-navy dark:text-accent hover:text-accent/80 font-medium transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
