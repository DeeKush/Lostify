import { motion } from "framer-motion";

export default function PostCard({ post }) {
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
  console.log(post.username)
  const handleWhatsApp = () => {
    const phone = formatPhoneNumber(post.contactInfo);
    const message = encodeURIComponent(
      `Hi, I'm contacting you about "${post.title}" on Lostify.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const borderColor = post.type === "lost" ? "border-l-lost" : "border-l-found";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`card overflow-hidden border-l-4 ${borderColor} hover:shadow-2xl transition-shadow duration-200`}
    >
      {post.imageURL ? (
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={post.imageURL}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-lightGray dark:bg-navy flex items-center justify-center">
          <svg
            className="w-16 h-16 text-charcoal/40 dark:text-white/50"
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

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold text-charcoal dark:text-white">
            {post.title}
          </h3>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              post.type === "lost"
                ? "bg-lost text-white"
                : "bg-found text-white"
            }`}
          >
            {post.type.toUpperCase()}
          </motion.span>
        </div>

        <p className="text-charcoal/70 dark:text-white/80 mb-3">
          {post.description}
        </p>

        <div className="space-y-1 text-sm text-charcoal/60 dark:text-white/60 mb-4">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {post.location}
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {formatDateTime(post.date || post.createdAt)}
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {post.category}
          </p>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Posted by {post.username.split(".")[0]}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-found hover:bg-found/90 text-white font-heading font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {post.type === "lost" ? "Message Finder" : "Message Owner"}
        </motion.button>
      </div>
    </motion.div>
  );
}
