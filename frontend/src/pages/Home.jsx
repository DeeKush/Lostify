import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <div
        className="relative bg-gradient-to-br from-navy via-navy to-charcoal dark:from-charcoal dark:via-navy dark:to-navy overflow-hidden"
        style={{ minHeight: '600px' }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-heading font-bold text-white mb-6"
            >
              Lost something? Found something?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              A secure Lost & Found system built exclusively for{' '}
              <span className="text-accent font-semibold">Scaler School of Technology</span> students.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={user ? '/create' : '/login'}
                  className="bg-lost text-white px-8 py-4 rounded-lg text-lg font-heading font-semibold hover:bg-lost/90 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                >
                  Report Lost Item
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={user ? '/create' : '/login'}
                  className="bg-accent text-navy px-8 py-4 rounded-lg text-lg font-heading font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                >
                  Report Found Item
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-charcoal dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-charcoal/70 dark:text-white/80 text-lg">
              Simple, secure, and effective lost & found process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '📝',
                title: '1. Post Your Item',
                description: 'Report a lost or found item with photos and detailed descriptions',
              },
              {
                icon: '🔍',
                title: '2. Smart Matching',
                description: 'Our AI matches lost items with found items automatically',
              },
              {
                icon: '📱',
                title: '3. Connect & Recover',
                description: 'Contact via WhatsApp and reunite with your belongings',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-6xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-white">
                  {step.title}
                </h3>
                <p className="text-charcoal/70 dark:text-white/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeIn} className="card p-8 md:p-12 bg-navy text-white">
            <h2 className="text-3xl font-heading font-bold mb-6 text-accent">
              Why Only SST Students?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔒</span> Trust & Verification
                </h3>
                <p className="text-white/80">
                  Every user is verified through their @sst.scaler.com email, ensuring a trusted
                  community of genuine students.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Campus-Specific
                </h3>
                <p className="text-white/80">
                  Items are more likely to be recovered within a closed, campus-based community with
                  shared spaces.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Faster Recovery
                </h3>
                <p className="text-white/80">
                  Limited to SST students means faster matching and quicker item recovery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛡️</span> Privacy Protection
                </h3>
                <p className="text-white/80">
                  Your contact information is only shared with verified SST students, protecting your
                  privacy.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeIn} className="text-center mb-8">
            <h2 className="text-4xl font-heading font-bold text-charcoal dark:text-white mb-4">
              Privacy & Security
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '✓',
                title: 'Restricted Access',
                description: 'Only verified @sst.scaler.com emails can access the platform',
              },
              {
                icon: '✓',
                title: 'Verified Login',
                description: 'Secure authentication via Google OAuth or password',
              },
              {
                icon: '✓',
                title: 'Protected Contact',
                description: 'Your phone number is only visible to matched users',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 bg-found text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 text-charcoal dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-charcoal/70 dark:text-white/80 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
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
        )}
      </div>
    </div>
  );
}
