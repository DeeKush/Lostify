import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MdVerifiedUser, 
  MdSpeed, 
  MdSecurity, 
  MdLocationOn,
  MdPeople,
  MdTrendingUp,
  MdCheckCircle,
  MdLock,
  MdVpnKey,
  MdPhoneAndroid,
  MdExpandMore
} from 'react-icons/md';

export default function Home() {
  const { user } = useAuth();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePosts: 0,
    resolvedPosts: 0,
    lostPosts: 0,
    foundPosts: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/posts/stats/public');
        setStats(response.data);
        setLoadingStats(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  // Sample data for Recent Activity
  const recentItems = [
    {
      id: 1,
      title: 'Black iPhone 13 Pro',
      type: 'lost',
      location: 'Library 3rd Floor',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1592286927505-2ff0e29f0c1b?w=400',
      description: 'Black iPhone 13 Pro with blue case',
      date: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Blue Backpack',
      type: 'found',
      location: 'Cafeteria',
      category: 'Bags',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      description: 'Blue backpack with SST logo',
      date: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Student ID Card',
      type: 'found',
      location: 'Main Gate',
      category: 'Documents',
      imageUrl: 'https://images.unsplash.com/photo-1589395937772-5f6d155ce8f9?w=400',
      description: 'Student ID card found near main gate',
      date: new Date().toISOString(),
    },
  ];

  // Dynamic metrics from real backend data
  const metrics = [
    { icon: <MdPeople />, value: loadingStats ? '...' : `${stats.totalUsers}+`, label: 'Active SST Students' },
    { icon: <MdTrendingUp />, value: loadingStats ? '...' : stats.activePosts, label: 'Active Posts' },
    { icon: <MdCheckCircle />, value: loadingStats ? '...' : stats.resolvedPosts, label: 'Items Reunited' },
    { icon: <MdLocationOn />, value: loadingStats ? '...' : `${Math.round((stats.resolvedPosts / Math.max(stats.activePosts + stats.resolvedPosts, 1)) * 100)}%`, label: 'Success Rate' },
  ];

  const faqs = [
    {
      question: 'How does Lostify work?',
      answer: 'Lostify uses AI-powered matching to connect lost and found items. Simply post your item with a photo and description, and our system will automatically match it with potential matches from the opposite category. You\'ll be notified of matches and can contact the other person via WhatsApp.',
    },
    {
      question: 'Who can use this platform?',
      answer: 'Only verified Scaler School of Technology students with a valid @sst.scaler.com email address can access and use Lostify. This ensures a trusted, secure community of genuine students.',
    },
    {
      question: 'Is my phone number public?',
      answer: 'No! Your phone number is only visible to users who have a matched item with yours. We protect your privacy by showing contact info only to relevant matches, never publicly.',
    },
    {
      question: 'How does the matching system work?',
      answer: 'Our AI analyzes item descriptions, categories, locations, and dates to find potential matches. When a match is found with high confidence, both users are notified and can see each other\'s contact information to arrange item recovery.',
    },
    {
      question: 'How do I report a bug or give feedback?',
      answer: 'Use the Feedback page from the navigation menu to report bugs, suggest features, or share your experience. We read all feedback carefully and continuously improve the platform based on your suggestions.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard security practices including encrypted passwords, secure authentication via Google OAuth, HTTPS connections, and access restricted to verified SST emails only. Your privacy and data security are our top priorities.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Viewport Height */}
      <div className="relative h-screen bg-gradient-to-br from-navy via-navy to-charcoal dark:from-charcoal dark:via-navy dark:to-navy overflow-hidden flex items-center justify-center">
        {/* Background Pattern - Full Coverage */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Centered Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center flex flex-col items-center justify-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-4 sm:mb-6 px-4"
            >
              Lost something? Found something?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto px-4"
            >
              A secure Lost & Found system built exclusively for{' '}
              <span className="text-accent font-semibold">Scaler School of Technology</span> students.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl px-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  to={user ? '/create' : '/login'}
                  className="bg-lost text-white px-8 py-4 rounded-lg text-base sm:text-lg font-heading font-semibold hover:bg-lost/90 transition-all duration-300 shadow-lg hover:shadow-xl block text-center w-full sm:w-auto sm:min-w-[200px]"
                >
                  Report Lost Item
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  to={user ? '/create' : '/login'}
                  className="bg-accent text-navy px-8 py-4 rounded-lg text-base sm:text-lg font-heading font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl block text-center w-full sm:w-auto sm:min-w-[200px]"
                >
                  Report Found Item
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Section */}
      {/* <div className="bg-lightGray dark:bg-charcoal py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal dark:text-white mb-4">
                Recent Lost & Found Items
              </h2>
              <p className="text-charcoal/70 dark:text-white/80 text-lg">
                See what's been posted recently by SST students
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible">
              {recentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="card overflow-hidden border-l-4 hover:shadow-2xl transition-all duration-300 min-w-[280px] md:min-w-0"
                  style={{ borderLeftColor: item.type === 'lost' ? '#EF4444' : '#10B981' }}
                >
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-bold text-charcoal dark:text-white">
                        {item.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          item.type === 'lost'
                            ? 'bg-lost text-white'
                            : 'bg-found text-white'
                        }`}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal/70 dark:text-white/80 mb-3">
                      {item.description}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-charcoal/60 dark:text-white/60">
                      <MdLocationOn className="w-4 h-4" />
                      {item.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeIn}
              className="text-center mt-10"
            >
              <Link
                to={user ? '/dashboard' : '/login'}
                className="inline-block bg-accent text-navy px-8 py-3 rounded-lg font-heading font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse All Items
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div> */}

      {/* How It Works Section - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-charcoal/70 dark:text-white/80 text-lg max-w-2xl mx-auto">
              Three simple steps to reunite with your belongings or help others find theirs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Post Your Item',
                step: '01',
                description: 'Report a lost or found item with photos and detailed descriptions',
                color: 'from-blue-500 to-blue-600',
                glowColor: 'shadow-blue-500/20',
              },
              {
                icon: '🔍',
                title: 'Smart Matching',
                step: '02',
                description: 'Our AI matches lost items with found items automatically',
                color: 'from-purple-500 to-purple-600',
                glowColor: 'shadow-purple-500/20',
              },
              {
                icon: '📱',
                title: 'Connect & Recover',
                step: '03',
                description: 'Contact via WhatsApp and reunite with your belongings',
                color: 'from-green-500 to-green-600',
                glowColor: 'shadow-green-500/20',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { duration: 0.3, ease: 'easeOut' } 
                }}
                className={`card p-8 text-center hover:shadow-2xl ${step.glowColor} transition-all duration-300 relative overflow-hidden group cursor-pointer`}
              >
                {/* Animated gradient bar */}
                <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`}></div>
                
                {/* Step number background */}
                <div className="absolute top-4 right-4 text-7xl font-bold text-charcoal/5 dark:text-white/5 font-heading">
                  {step.step}
                </div>

                {/* Icon with animation */}
                <motion.div
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1],
                    transition: { duration: 0.6 } 
                  }}
                  className="text-7xl mb-6 inline-block relative z-10"
                >
                  {step.icon}
                </motion.div>

                <h3 className="text-xl font-heading font-bold mb-3 text-charcoal dark:text-white relative z-10">
                  {step.title}
                </h3>
                <p className="text-charcoal/70 dark:text-white/80 leading-relaxed relative z-10">
                  {step.description}
                </p>

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Platform Metrics Section - Real Data */}
      {/* <div className="bg-gradient-to-br from-navy via-navy to-charcoal dark:from-charcoal dark:via-navy dark:to-navy py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="metrics-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#metrics-grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                Platform Metrics
              </h2>
              <p className="text-white/80 text-lg">
                Real-time statistics from our growing SST community
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -5,
                    transition: { duration: 0.3 } 
                  }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border border-white/20 cursor-pointer"
                >
                  <motion.div
                    animate={{ 
                      scale: loadingStats ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 1.5, repeat: loadingStats ? Infinity : 0 }}
                    className="text-4xl sm:text-5xl text-accent mb-4 flex justify-center drop-shadow-lg"
                  >
                    {metric.icon}
                  </motion.div>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2 font-heading">
                    {metric.value}
                  </div>
                  <div className="text-sm text-white/80 font-medium">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {loadingStats && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-white/60 mt-6 text-sm"
              >
                Loading live statistics...
              </motion.p>
            )}
          </motion.div>
        </div>
      </div> */}

      {/* Why Only SST Students - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeIn} 
            className="card p-8 md:p-12 bg-gradient-to-br from-navy via-navy to-charcoal text-white relative overflow-hidden shadow-2xl"
          >
            {/* Animated shimmer background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-shimmer"></div>
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/20"></div>
            </div>
            
            <div className="relative z-10">
              <motion.h2 
                variants={fadeIn}
                className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-accent"
              >
                Why Only SST Students?
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-white/80 text-lg mb-10 max-w-3xl"
              >
                A trusted, secure, and efficient community built exclusively for Scaler School of Technology
              </motion.p>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <MdVerifiedUser className="text-4xl" />,
                    title: 'Trust & Verification',
                    description: 'Every user is verified through their @sst.scaler.com email, ensuring a trusted community of genuine students.',
                    delay: 0,
                  },
                  {
                    icon: <MdLocationOn className="text-4xl" />,
                    title: 'Campus-Specific',
                    description: 'Items are more likely to be recovered within a closed, campus-based community with shared spaces.',
                    delay: 0.1,
                  },
                  {
                    icon: <MdSpeed className="text-4xl" />,
                    title: 'Faster Recovery',
                    description: 'Limited to SST students means faster matching and quicker item recovery with people you know.',
                    delay: 0.2,
                  },
                  {
                    icon: <MdSecurity className="text-4xl" />,
                    title: 'Privacy Protection',
                    description: 'Your contact information is only shared with verified SST students, protecting your privacy.',
                    delay: 0.3,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={slideInLeft}
                    transition={{ delay: feature.delay }}
                    whileHover={{ 
                      x: 10,
                      transition: { duration: 0.3 } 
                    }}
                    className="flex gap-5 group cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-navy transition-all duration-300 shadow-lg group-hover:shadow-accent/50">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-accent transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Privacy & Security - Enhanced */}
      <div className="bg-lightGray dark:bg-charcoal py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal dark:text-white mb-4">
                Privacy & Security First
              </h2>
              <p className="text-charcoal/70 dark:text-white/80 text-lg max-w-2xl mx-auto">
                Your safety and privacy are our top priorities. Built with security at every level.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MdLock />,
                  title: 'Restricted Access',
                  description: 'Only verified @sst.scaler.com emails can access the platform',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-500',
                },
                {
                  icon: <MdVpnKey />,
                  title: 'Secure Authentication',
                  description: 'Protected login via Google OAuth and encrypted passwords',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-500',
                },
                {
                  icon: <MdPhoneAndroid />,
                  title: 'Protected Contact',
                  description: 'Your phone number is only visible to matched users',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-500',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    transition: { duration: 0.3 } 
                  }}
                  className="card p-8 text-center hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-charcoal/10 dark:hover:border-white/10"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ 
                      scale: [1, 1.2, 1.1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 ${feature.bgColor} text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl group-hover:shadow-2xl`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold mb-3 text-charcoal dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal/70 dark:text-white/80 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Accent line */}
                  <div className={`mt-6 h-1 w-16 mx-auto bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-charcoal/70 dark:text-white/80 text-lg">
              Everything you need to know about Lostify
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-lightGray dark:hover:bg-charcoal transition-colors duration-200"
                >
                  <h3 className="text-lg font-heading font-semibold text-charcoal dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <MdExpandMore className="w-6 h-6 text-charcoal dark:text-white" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-charcoal/70 dark:text-white/80">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-br from-accent via-accent to-yellow-500 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-5xl font-heading font-bold text-navy mb-4"
            >
              Ready to Post or Find Your Item?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg sm:text-xl text-navy/80 mb-8"
            >
              Fast, secure, and built exclusively for SST students.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={user ? '/create' : '/login'}
                  className="bg-lost text-white px-8 py-4 rounded-lg text-lg font-heading font-semibold hover:bg-lost/90 transition-all duration-300 shadow-xl hover:shadow-2xl inline-block w-full sm:w-auto"
                >
                  Report Lost Item
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="bg-navy text-white px-8 py-4 rounded-lg text-lg font-heading font-semibold hover:bg-navy/90 transition-all duration-300 shadow-xl hover:shadow-2xl inline-block w-full sm:w-auto"
                >
                  Browse Items
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-charcoal/70 dark:text-white/80 mb-6">
              Join the SST community and help reunite students with their belongings
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="bg-accent text-navy px-8 py-4 rounded-lg text-lg font-heading font-semibold hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl inline-block"
              >
                Sign In with SST Google Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
