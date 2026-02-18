import { motion } from "motion/react";
import { Heart, Cake, Sparkles } from "lucide-react";

// Generate random durations once at module level
const confettiAnimations = Array.from({ length: 5 }, (_, i) => ({
  duration: 4 + i * 0.5,
  delay: i * 0.6,
}));

export default function BirthdayBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-linear-to-r from-pink-100 via-purple-100 to-blue-100 border-y-2 border-pink-300 py-3 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Cake className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 fill-current" />
        </motion.div>

        <div className="text-center">
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-base sm:text-lg font-semibold bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Happy Birthday Majha god Vidhu! • February 19, 2026
          </motion.p>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Celebrating wonderful memories together 💝
          </p>
        </div>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 fill-current" />
        </motion.div>
      </div>

      {/* Floating confetti effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiAnimations.map((anim, i) => (
          <motion.div
            key={i}
            initial={{ y: "-10%", x: `${i * 12}%`, opacity: 0 }}
            animate={{
              y: "110%",
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: anim.duration,
              repeat: Infinity,
              delay: anim.delay,
              ease: "linear",
            }}
            className="absolute"
          >
            <Heart
              className={`w-3 h-3 ${
                i % 3 === 0
                  ? "text-pink-400"
                  : i % 3 === 1
                    ? "text-purple-400"
                    : "text-blue-400"
              } fill-current opacity-40`}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
