import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from './ContactModal';
import logo from '../assets/lostify-logo.jpg';

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stable smooth scroll handler - works across all browsers including Safari
  const handleScrollToTop = useCallback(() => {
    // Primary method - works in modern browsers
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for older browsers (including older Safari versions)
      const scrollStep = -window.scrollY / (500 / 15);
      const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    }
  }, []);

  // For footer links - regular smooth scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-navy dark:bg-navy text-lightGray dark:text-lightGray mt-auto py-8 sm:py-12 border-t border-white/10 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <img
                src={logo}
                alt="Lostify Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h3 className="text-base sm:text-lg font-heading font-bold text-accent mb-2">About</h3>
            <p className="text-lightGray/90 text-sm leading-relaxed">
              Lostify is a secure Lost & Found portal for the Scaler School of Technology community.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-base">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  onClick={scrollToTop}
                  className="text-lightGray/80 hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  onClick={scrollToTop}
                  className="text-lightGray/80 hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 inline-block"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  onClick={scrollToTop}
                  className="text-lightGray/80 hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 inline-block"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  onClick={scrollToTop}
                  className="text-lightGray/80 hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 inline-block"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    scrollToTop();
                    setShowContact(true);
                  }}
                  className="text-lightGray/80 hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4 transition-all duration-200 text-left"
                >
                  Feedback & Support
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-base">Disclaimer</h4>
            <p className="text-lightGray/80 text-sm leading-relaxed">
              This platform is a convenience project created for SST students.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 sm:pt-8 text-center">
          <p className="text-lightGray/60 text-sm mb-2">
            © {new Date().getFullYear()} Lostify. All rights reserved.
          </p>
          <p className="text-accent text-xs font-medium">
            Designed & Developed by Deepak and Kartik
          </p>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/90 text-navy p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
            aria-label="Back to top"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-y-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </motion.footer>
  );
}
