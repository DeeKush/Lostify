import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import MyMatches from './pages/MyMatches';
import AdminDashboard from './pages/AdminDashboard';
import AdminBrowse from './pages/AdminBrowse';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Feedback from './pages/Feedback';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl text-charcoal dark:text-white"
        >
          Loading...
        </motion.div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl text-charcoal dark:text-white"
        >
          Loading...
        </motion.div>
      </div>
    );
  }
  
  return user && user.isAdmin ? children : <Navigate to="/dashboard" />;
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen bg-lightGray dark:bg-navy transition-colors duration-300">
          <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'toast-notification',
            style: {
              background: '#1E2A45',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              style: {
                background: '#10B981',
                color: '#FFFFFF',
              },
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: '#FFFFFF',
              },
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#EF4444',
              },
            },
            loading: {
              style: {
                background: '#F8C538',
                color: '#1E2A45',
              },
              iconTheme: {
                primary: '#1E2A45',
                secondary: '#F8C538',
              },
            },
          }}
        />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CreatePost />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-posts"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <MyPosts />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-matches"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <MyMatches />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Settings />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/browse"
              element={
                <AdminRoute>
                  <PageTransition>
                    <AdminBrowse />
                  </PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <PageTransition>
                    <Users />
                  </PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <PageTransition>
                    <Analytics />
                  </PageTransition>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <AdminRoute>
                  <PageTransition>
                    <Feedback />
                  </PageTransition>
                </AdminRoute>
              }
            />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
