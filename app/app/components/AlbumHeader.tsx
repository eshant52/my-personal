import { motion } from "motion/react";
import { Heart, ChevronDown, Gift } from "lucide-react";

export default function AlbumHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center py-12 px-4 relative"
    >
      {/* Decorative gift icons */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute top-8 left-4 sm:left-12"
      >
        <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 fill-current opacity-30" />
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="absolute top-8 right-4 sm:right-12"
      >
        <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 fill-current opacity-30" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="inline-block"
      >
        <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 fill-current" />
      </motion.div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 px-4">
        Our Memories
      </h1>
      <p className="text-gray-600 text-base sm:text-lg md:text-xl px-4">
        Every moment with you is special ✨
      </p>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-8 inline-block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-pink-400 mx-auto" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
