import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdClose, 
  MdReportProblem, 
  MdCheckCircle, 
  MdLocationOn, 
  MdCalendarMonth, 
  MdPhone, 
  MdPerson,
  MdCategory,
  MdDevices,
  MdWork,
  MdDescription,
  MdCheckroom,
  MdShare,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ItemDetailModal({ post, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const images = post.imageUrl ? [post.imageUrl] : [];
  const hasMultipleImages = images.length > 1;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} (${hours}:${minutes} ${ampm})`;
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.startsWith("91")) {
      return `+${cleaned}`;
    }
    return `+91${cleaned}`;
  };

  const getCategoryIcon = (category) => {
    const lowerCategory = category?.toLowerCase() || '';
    if (lowerCategory.includes('electronic') || lowerCategory.includes('phone') || lowerCategory.includes('laptop')) {
      return <MdDevices className="w-5 h-5" />;
    }
    if (lowerCategory.includes('bag')) {
      return <MdWork className="w-5 h-5" />;
    }
    if (lowerCategory.includes('document') || lowerCategory.includes('id') || lowerCategory.includes('card')) {
      return <MdDescription className="w-5 h-5" />;
    }
    if (lowerCategory.includes('cloth') || lowerCategory.includes('shirt') || lowerCategory.includes('jacket')) {
      return <MdCheckroom className="w-5 h-5" />;
    }
    return <MdCategory className="w-5 h-5" />;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phone = formatPhoneNumber(post.contactInfo);
    const message = encodeURIComponent(
      `Hi, I saw your Lostify post about "${post.title}" and I want to contact you regarding it.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-navy rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-[70%] lg:max-w-[50%] max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-navy/90 hover:bg-accent hover:text-navy p-2 rounded-full shadow-lg transition-all duration-200"
              aria-label="Close modal"
            >
              <MdClose className="w-6 h-6" />
            </button>

            {/* Image Section with Carousel */}
            {images.length > 0 ? (
              <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={images[currentImageIndex]}
                  alt={post.title}
                  className="w-full h-full object-contain"
                />

                {/* Carousel Controls */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-navy/80 hover:bg-accent hover:text-navy p-2 rounded-full shadow-lg transition-all duration-200"
                      aria-label="Previous image"
                    >
                      <MdChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-navy/80 hover:bg-accent hover:text-navy p-2 rounded-full shadow-lg transition-all duration-200"
                      aria-label="Next image"
                    >
                      <MdChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-56 sm:h-64 md:h-72 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                <svg
                  className="w-20 h-20 text-charcoal/40 dark:text-white/50"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6 space-y-6">
              {/* Title and Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal dark:text-white break-words flex-1">
                  {post.title}
                </h2>
                <div className="flex items-center gap-2">
                  {post.type === "lost" ? (
                    <MdReportProblem className="w-6 h-6 text-lost" />
                  ) : (
                    <MdCheckCircle className="w-6 h-6 text-found" />
                  )}
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${
                      post.type === "lost" ? "bg-lost text-white" : "bg-found text-white"
                    }`}
                  >
                    {post.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              {post.status && post.status !== 'active' && (
                <div className="inline-block px-4 py-2 bg-charcoal/20 dark:bg-white/20 rounded-lg">
                  <span className="text-sm font-semibold text-charcoal dark:text-white">
                    Status: {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-heading font-semibold text-charcoal dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-base text-charcoal/80 dark:text-white/80 leading-relaxed break-words">
                  {post.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex items-center gap-3 p-3 bg-lightGray dark:bg-charcoal rounded-lg">
                  {getCategoryIcon(post.category)}
                  <div>
                    <p className="text-xs text-charcoal/60 dark:text-white/60">Category</p>
                    <p className="text-sm font-semibold text-charcoal dark:text-white">
                      {post.category}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 bg-lightGray dark:bg-charcoal rounded-lg">
                  <MdLocationOn className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-charcoal/60 dark:text-white/60">Location</p>
                    <p className="text-sm font-semibold text-charcoal dark:text-white break-words">
                      {post.location}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 p-3 bg-lightGray dark:bg-charcoal rounded-lg">
                  <MdCalendarMonth className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-charcoal/60 dark:text-white/60">Date</p>
                    <p className="text-sm font-semibold text-charcoal dark:text-white">
                      {formatDateTime(post.date || post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-3 p-3 bg-lightGray dark:bg-charcoal rounded-lg">
                  <MdPhone className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-charcoal/60 dark:text-white/60">Contact</p>
                    <p className="text-sm font-semibold text-charcoal dark:text-white">
                      {formatPhoneNumber(post.contactInfo)}
                    </p>
                  </div>
                </div>

                {/* Posted By */}
                <div className="flex items-center gap-3 p-3 bg-lightGray dark:bg-charcoal rounded-lg sm:col-span-2">
                  <MdPerson className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-charcoal/60 dark:text-white/60">Posted By</p>
                    <p className="text-sm font-semibold text-charcoal dark:text-white">
                      {post.username?.split('.')[0] || 'Unknown User'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 bg-found hover:bg-found/90 text-white font-heading font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-110"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Contact on WhatsApp</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-navy font-heading font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-110"
                >
                  <MdShare className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
