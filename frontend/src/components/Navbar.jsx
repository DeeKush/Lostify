import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/lostify-logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingFeedbackCount, setPendingFeedbackCount] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchPendingFeedback();
      const interval = setInterval(fetchPendingFeedback, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPendingFeedback = async () => {
    try {
      const response = await axios.get('https://lostify-sst.onrender.com/feedback/count/pending', { withCredentials: true });
      setPendingFeedbackCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch pending feedback count');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    toast.success('Logged out successfully!');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `relative text-white hover:text-accent px-3 py-2 text-sm font-medium transition-all duration-300 ${
      isActive(path) ? 'text-accent' : ''
    }`;

  const NavLink = ({ to, children }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -1 }}
      transition={{ duration: 0.15 }}
      className="inline-block"
    >
      <Link to={to} className={linkClasses(to)} onClick={handleNavClick}>
        {children}
        {isActive(to) && (
          <motion.div
            layoutId="navbar-underline"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
            initial={false}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={handleNavClick}
      className={`block px-4 py-3 text-base font-medium transition-colors ${
        isActive(to)
          ? 'bg-accent text-navy'
          : 'text-white hover:bg-accent/20 hover:text-accent'
      }`}
    >
      {children}
    </Link>
  );

  const userNavLinks = (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dashboard">Browse</NavLink>
      <NavLink to="/create">Post Item</NavLink>
      <NavLink to="/my-posts">My Posts</NavLink>
      <NavLink to="/my-matches">My Matches</NavLink>
    </>
  );

  const mobileUserNavLinks = (
    <>
      <MobileNavLink to="/">Home</MobileNavLink>
      <MobileNavLink to="/dashboard">Browse</MobileNavLink>
      <MobileNavLink to="/create">Post Item</MobileNavLink>
      <MobileNavLink to="/my-posts">My Posts</MobileNavLink>
      <MobileNavLink to="/my-matches">My Matches</MobileNavLink>
    </>
  );

  const adminNavLinks = (
    <>
      <NavLink to="/admin/dashboard">Dashboard</NavLink>
      <NavLink to="/admin/browse">Browse Posts</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
      <NavLink to="/admin/analytics">Analytics</NavLink>
      <Link to="/admin/feedback" className={linkClasses('/admin/feedback')} onClick={handleNavClick}>
        <span className="relative">
          Feedback
          {pendingFeedbackCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-3 bg-accent text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {pendingFeedbackCount}
            </motion.span>
          )}
          {isActive('/admin/feedback') && (
            <motion.div
              layoutId="navbar-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              initial={false}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </span>
      </Link>
    </>
  );

  const mobileAdminNavLinks = (
    <>
      <MobileNavLink to="/admin/dashboard">Dashboard</MobileNavLink>
      <MobileNavLink to="/admin/browse">Browse Posts</MobileNavLink>
      <MobileNavLink to="/admin/users">Users</MobileNavLink>
      <MobileNavLink to="/admin/analytics">Analytics</MobileNavLink>
      <Link
        to="/admin/feedback"
        onClick={handleNavClick}
        className={`block px-4 py-3 text-base font-medium transition-colors ${
          isActive('/admin/feedback')
            ? 'bg-accent text-navy'
            : 'text-white hover:bg-accent/20 hover:text-accent'
        }`}
      >
        <span className="flex items-center gap-2">
          Feedback
          {pendingFeedbackCount > 0 && (
            <span className="bg-accent text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingFeedbackCount}
            </span>
          )}
        </span>
      </Link>
    </>
  );

  const userInitial = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-navy shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Mobile burger menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white hover:text-accent p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={mobileMenuOpen ? 'open' : 'closed'}
                  className="w-6 h-5 flex flex-col justify-between"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 8 }
                    }}
                    className="w-full h-0.5 bg-current block origin-center transition-all"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    className="w-full h-0.5 bg-current block transition-all"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -8 }
                    }}
                    className="w-full h-0.5 bg-current block origin-center transition-all"
                  />
                </motion.div>
              </button>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
              onClick={() => navigate(user ? '/dashboard' : '/')}
            >
              <img
                src={logo}
                alt="Lostify Logo"
                className="h-8 sm:h-10 w-auto object-contain rounded-lg"
              />
            </motion.div>
            {user?.isAdmin && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-accent text-navy text-xs font-heading font-bold rounded-full"
              >
                ADMIN
              </motion.span>
            )}
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {user ? (user.isAdmin ? adminNavLinks : userNavLinks) : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.div
                  whileHover={{ scale: 1.1, opacity: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border-2 border-accent object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded-full font-heading font-semibold text-navy bg-accent hover:opacity-90 transition-opacity">
                      {userInitial}
                    </div>
                  )}
                </motion.div>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-lightGray dark:bg-navy rounded-lg shadow-xl border border-charcoal/20 dark:border-white/20 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-charcoal/20 dark:border-white/20">
                        <p className="text-sm font-semibold text-charcoal dark:text-white truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-charcoal/70 dark:text-white/70 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-charcoal dark:text-white hover:bg-accent hover:text-navy transition-colors flex items-center gap-2"
                        onClick={() => {
                          navigate('/settings');
                          setProfileMenuOpen(false);
                        }}
                      >
                        <span>⚙️</span>
                        <span>Settings</span>
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-charcoal dark:text-white hover:bg-accent hover:text-navy transition-colors flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/login"
                  className="bg-accent text-navy px-4 py-2 rounded-lg font-heading font-semibold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg inline-block text-sm"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-16 left-0 bottom-0 w-64 bg-navy shadow-2xl md:hidden z-50 overflow-y-auto"
            >
              <div className="py-4">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-white/20 mb-2">
                  <div className="flex items-center gap-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="h-12 w-12 rounded-full border-2 border-accent object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center rounded-full font-heading font-semibold text-navy bg-accent">
                        {userInitial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-white/70 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  {user.isAdmin ? mobileAdminNavLinks : mobileUserNavLinks}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base font-medium text-white hover:bg-accent/20 hover:text-accent transition-colors flex items-center gap-3"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-base font-medium text-white hover:bg-accent/20 hover:text-accent transition-colors flex items-center gap-3"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
